import axios from 'axios';

// 로컬스토리지에서 토큰을 가져오는 함수
const getLocalStorage = (key) => {
	return localStorage.getItem(key);
};

// 로컬스토리지에 토큰을 저장하는 함수
const setLocalStorage = (key, value) => {
	localStorage.setItem(key, value);
};

// 로컬스토리지에서 토큰을 제거하는 함수
const removeLocalStorage = (key) => {
	localStorage.removeItem(key);
};

// JWT 만료 여부를 체크하는 함수
const CheckJWTExp = () => {
	const token = localStorage.getItem('accessToken');
	if (!token) {
		return 'NO_TOKEN';
	}

	const decodedToken = parseJWT(token);
	if (!decodedToken || !decodedToken.exp) {
		return 'INVALID_TOKEN';
	}

	const currentTime = Math.floor(Date.now() / 1000); // 현재 시간을 초 단위로 얻기

	if (decodedToken.exp < currentTime) {
		return 'ACCESS_EXP_MESSAGE'; // 토큰이 만료된 경우
	}

	return 'VALID_TOKEN'; // 토큰이 유효한 경우
};

// JWT 디코딩 함수
const parseJWT = (token) => {
	try {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map(function (c) {
					return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join(''),
		);
		return JSON.parse(jsonPayload);
	} catch (error) {
		console.error('Invalid JWT token:', error);
		return null;
	}
};

// Base URL 및 인스턴스 생성
const baseURL = 'http://43.201.210.211:8080';
const instance = axios.create({
	baseURL: baseURL,
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
	},
});

// 요청 인터셉터 설정
instance.interceptors.request.use(
	(config) => {
		const accessToken = getLocalStorage('accessToken');
		const refreshToken = getLocalStorage('refreshToken');
		if (accessToken) {
			/** 2. access토큰 있으면 만료됐는지 체크 */
			if (CheckJWTExp() === 'ACCESS_EXP_MESSAGE') {
				/** 3. 만료되면 만료된 access, refresh 같이 헤더 담아서 요청 */
				config.headers.Authorization = `Bearer ${accessToken}`;
				config.headers.Refresh = refreshToken;
			} else {
				config.headers.Authorization = `Bearer ${accessToken}`;
			}
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// 응답 인터셉터 설정
instance.interceptors.response.use(
	async (response) => {
		// response.data 및 response.data.data가 존재하는지 확인
		if (response.data && response.data.data) {
			const { accessToken, refreshToken } = response.data.data;

			if (accessToken) {
				// 이전 토큰 삭제 및 새 토큰 저장
				removeLocalStorage('accessToken');
				setLocalStorage('accessToken', accessToken);
			}
			if (refreshToken) {
				removeLocalStorage('refreshToken');
				setLocalStorage('refreshToken', refreshToken);
			}
		} else {
			console.log(response.data.message);
		}

		return response;
	},
	(error) => {
		// 응답 200 아닌 경우 - 디버깅
		return Promise.reject(error);
	},
);

export default instance;
