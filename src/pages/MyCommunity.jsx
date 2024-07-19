import { GrowthStateContext } from "../App";
import { useContext, useState, useRef, useEffect } from "react";
import HeaderMyPage from "../components/HeaderMyPage";
import MenubarMyPage from "../components/MenubarMyPage";
import MyCommunityItem from "../components/MyCommunityItem";
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const communityData = [
  {
    id: 0,
    category: "포트폴리오",
    title: "프론트엔드 개발자 구하는 방법 물어봅니다.",
    writer: "김수윤",
    date: new Date("2024-7-24"),
  },
  {
    id: 1,
    category: "자유",
    title: "백엔드 스터디 같이 하실 분 찾아요",
    writer: "김수윤",
    date: new Date("2024-7-24"),
  },
];

const MyCommunity = () => {
  const [memberData, jobPostData, applicationData, applicaionDetailData, infoData] = useContext(GrowthStateContext);
  const [isOpen, setIsOpen] = useState(false);
  const inSection = useRef();

  const clickToggle = () => {
		setIsOpen(!isOpen);
	};

  useEffect(() => {
    const clickOutside = (e) => {
      if (
        isOpen &&
        !inSection.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", clickOutside);

    return () => {
      document.removeEventListener("mousedown", clickOutside);
    };
  }, [isOpen]);

  // 아이콘 스타일
	const iconClass = 'size-6 stroke-1';
  const menuItemClass = 'cursor-pointer p-4 rounded-[10px] hover:bg-gray-lightSide flex items-center justify-left gap-2';

  return (
    <div>
      <div className="ml-[70px] mt-[53px]">
        <HeaderMyPage name={infoData.name} company={infoData.company} />
      </div>
      <div className="mypage-content-container flex-col">
        <div className="menubar">
          <MenubarMyPage />
        </div>
        <div className="mypage-content w-[1492px] h-[692px] bg-white flex flex-col ml-[70px] mt-[28px] mb-[153px] rounded-[10px]">
          <div className="mypage-toggle h-[112px] flex justify-end relative">
            <div ref={inSection} onClick={clickToggle} className="w-[202px] h-[42px] mt-[42px] mb-[28px] mr-[41px] px-[20px] flex justify-between items-center bg-navy-mypageToggle rounded-[10px] cursor-pointer">
              <div>작성한 글</div>
              <ChevronDownIcon className={iconClass} />
            </div>
            {isOpen === true && (
            <div className="submenu absolute top-[96px] right-[41px] w-[202px] bg-white border rounded-[10px] shadow-lg">
              <div className={menuItemClass}>
                작성한 글
              </div>
              <div className={menuItemClass}>
                작성한 댓글
              </div>
              <div className={menuItemClass}>
                저장한 글
              </div>
            </div>
          )}
          </div>
          <div className="mypage-list">
            <div className="my-community-category w-[1383px] flex h-[61px] pt-[20px] pb-[21px] ml-[59px] mr-[50px] text-[16px] border-t-2 border-b">
              <div className='w-[56px] h-[19px] ml-[39px]'>카테고리</div>
              <div className='w-[28px] h-[19px] ml-[332px]'>제목</div>
              <div className='w-[42px] h-[19px] ml-[444px]'>작성자</div>
              <div className='w-[42px] h-[19px] ml-[183px]'>작성일</div>
            </div>
            <div className="my-community-content w-[1381px] h-[477px] ml-[61px] mr-[50px] my-[21px] flex-col">
              {communityData.map((data)=>{// 아이템 순회하면서 렌더링
                return (
                  <MyCommunityItem
                    key={data.id}
                    category={data.category}
                    title={data.title}
                    writer={data.writer}
                    date={data.date}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCommunity;