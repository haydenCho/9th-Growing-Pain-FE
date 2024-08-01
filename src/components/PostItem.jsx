import { FaRegCommentAlt, FaRegHeart, FaRegBookmark } from 'react-icons/fa';
import { useAtom } from 'jotai';
import CommentModal from '../components/CommentModal';
import CategoryTag from './CategoryTag';
import { useLocation } from 'react-router-dom';
import { modalOpenAtom } from '../utils/atoms';

const PostItem = ({
	id,
	nickname,
	createdTime,
	position,
	postTitle,
	content,
	userProfile,
	heart,
	comments = [],
	category,
	bookmark,
	replies,
}) => {
	const location = useLocation();
	const [modalId, setmodalId] = useAtom(modalOpenAtom);

	const isModalOpen = modalId === id;

	return (
		<div className="bg-white mr-[36px] rounded-[10px]">
			{/* 프로필 */}
			<div className="p-[36px]">
				<div className="flex items-center justify-between">
					<div className="flex items-center">
						{/* 프사 */}
						<span>
							<img src={userProfile} alt={`${nickname} profile`} className="rounded-full w-9 h-9" />
						</span>
						{/* 닉네임, 포지션, 시간 */}
						<div className="flex flex-col ml-[12px]">
							<div className="flex gap-2 items-end">
								<h1 className="text-[16px] font-medium">{nickname}</h1>
								<h1 className="text-[14px] text-gray-commuPosition">{position}</h1>
							</div>
							<h1 className="flex text-[14px] text-gray-commuPosition">{createdTime}</h1>
						</div>
					</div>
					{/* 좋아요, 댓글, 북마크 */}
					<div className="flex items-center gap-6">
						<span className="flex items-center text-[14px] gap-[10px] font-medium cursor-pointer">
							<FaRegHeart className="w-[20px] h-[20px]" />
							{heart}
						</span>
						<span
							className="flex items-center gap-[10px] text-[14px] font-medium cursor-pointer"
							onClick={() => setmodalId(id)}
						>
							<FaRegCommentAlt className="w-[20px] h-[20px]" />
							{comments.length}
						</span>
						<span className="flex cursor-pointer">
							<FaRegBookmark className="w-[20px] h-[20px]" />
						</span>
					</div>
				</div>
				{/* 글 본문, 카테고리 태그 */}
				<div className="flex justify-between gap-[36px]">
					<div className="flex flex-col gap-4 mt-[36px] rounded-[10px] place-items-start">
						<h1 className="text-[18px] font-medium">{postTitle}</h1>
						<h1 className="flex text-[16px] leading-[31px] whitespace-pre-line text-left">{content}</h1>
					</div>

					<div className="self-end">
						{(location.pathname === '/user/community/total' || location.pathname === '/user/community/member') && (
							<CategoryTag category={Array.isArray(category) ? category[1] : category} />
						)}
					</div>
				</div>
				{isModalOpen && (
					<CommentModal
						isOpen={modalId}
						onClose={() => window.history.back()}
						id={id}
						nickname={nickname}
						createdTime={createdTime}
						position={position}
						postTitle={postTitle}
						content={content}
						userProfile={userProfile}
						heart={heart}
						comments={comments}
						replies={replies}
					/>
				)}
			</div>
		</div>
	);
};

export default PostItem;
