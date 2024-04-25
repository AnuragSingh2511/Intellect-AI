"use client";

import {
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Button,
  Avatar,
  Skeleton,
} from "@nextui-org/react";
import { Poppins } from "next/font/google";
import { useEffect, useState } from "react";
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri";
import { GoCopy, GoDownload } from "react-icons/go";
import { PiMagicWand } from "react-icons/pi";
import { RxUpload } from "react-icons/rx";
import { MdOutlineDone } from "react-icons/md";
import { MdOutlineBookmarkAdd, MdDeleteOutline } from "react-icons/md";
import Menu from "./Menu";
import Link from "next/link";
const poppins = Poppins({
  weight: "600",
  subsets: ["latin"],
});
const litePoppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

function RelatedImages({ Data }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [backdrop, setBackdrop] = useState("blur");
  const [context, setContext] = useState(null);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      if (!isLoading) {
        setIsLoading(true);
      }
    }, 2000);
  }, [isLoading]);

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  }, [isCopied]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`/api/user?userId=${Data?.userId}`);
        const { success, data, error } = await response.json();
        if (success) {
          setUserData(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getUser();
  }, [Data]);

  const backdrops = "blur";
  const Images = [
    "https://replicate.delivery/pbxt/MkUfpm9XsUXmTSWf4r37w4rpTmXHWlaMKBoO5ElqN9XWbRbSA/out-0.png",
    "https://replicate.delivery/pbxt/R08KPL023tIKO59jt3UnbVYfBIWio8A5b6fz60OL4qLkXRbSA/out-0.png",
    "https://replicate.delivery/pbxt/mgsk9Y7uzU4hCpoLn8kmeIdHVmdfz9b3DBR276mRd8ie4i2kA/out-0.png",
  ];

  const handleOpen = (backdrop) => {
    setBackdrop(backdrop);
    onOpen();
    if (loading) {
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  };

  if (Data && Data?.urls?.length < 2) {
    return null;
  }

  let formattedDate;
  if (Data && Data?.urls.length > 0) {
    const date = new Date(Data?.createdAt);

    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    formattedDate = new Intl.DateTimeFormat("en-GB", options).format(date);
  }

  return (
    <>
      <div className="related-images">
        <Skeleton isLoaded={Data !== null} className="rounded-lg w-fit">
          <p className={`${poppins.className} text-2xl`}>Related Images</p>
        </Skeleton>
        <div className="images flex items-center justify-start flex-wrap mt-8 gap-4">
          <div className="flex flex-wrap gap-3">
            {Images?.map((image, index) => (
              <>
                <Skeleton isLoaded={Data !== null} className="rounded-lg w-fit">
                  <Image
                    isZoomed
                    key={index}
                    src={Data?.urls[index + 1]}
                    alt="image"
                    width={350}
                    height={350}
                    onClick={() => {
                      handleOpen(backdrops);
                      setContext(Data?.urls[index + 1]);
                    }}
                    className="cursor-pointer z-[1] max-w-full lg:max-w-[350px]"
                  />
                </Skeleton>
              </>
            ))}
          </div>
          <Modal
            backdrop={backdrop}
            isOpen={isOpen}
            size="4xl"
            onClose={() => {
              onClose();
              setLoading(true);
            }}
            className={`${litePoppins.className} my-modal`}
          >
            <ModalContent className="modal-body">
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1 "></ModalHeader>
                  <ModalBody className="mb-5">
                    <div className="modal-body items-center h-[600px] md:h-auto overflow-auto md:overflow-hidden flex flex-col md:flex-row md:items-start">
                      <div className="left hidden md:block">
                        {context && (
                          <>
                            <Menu />
                            <Image
                              src={context}
                              alt="image"
                              width={500}
                              height={500}
                              onContextMenu={(e) => {
                                e.preventDefault();
                              }}
                              className="cursor-pointer z-[1]"
                            />
                          </>

                          //   <img
                          //     src={context}
                          //     alt="image"
                          //     className="w-[400px] rounded-xl cursor-pointer z-[1]"
                          //   />
                        )}
                      </div>
                      <div className="right w-full md:w-fit ml-0 mt-0 md:mt-0 md:ml-8">
                        <div className="user-data flex items-center gap-4">
                          <Link href={`/profile/${userData?.username}`} className="flex items-center gap-4">
                            <Avatar
                              color="primary"
                              className="cursor-pointer"
                              src={userData?.profileImg}
                            />
                            <p className="w-max md:text-md text-md">
                              {userData?.name}
                            </p>
                          </Link>
                          {!isFollowed ? (
                            <Button
                              color="primary"
                              className="rounded-full"
                              onPress={() => setIsFollowed(true)}
                            >
                              <RiUserFollowLine
                                fontSize={18}
                                className="text-white"
                              />
                              Follow
                            </Button>
                          ) : (
                            <Button
                              color="primary"
                              variant="bordered"
                              className="rounded-full border-gray-600 text-white"
                              onPress={() => setIsFollowed(false)}
                            >
                              <RiUserUnfollowLine
                                fontSize={18}
                                className="text-white"
                              />
                              Unfollow
                            </Button>
                          )}
                        </div>
                        {context && (
                          <>
                            <Image
                              src={context}
                              alt="image"
                              width={500}
                              height={500}
                              className="block md:hidden mt-6 z-[1] w-fit cursor-pointer rounded-xl"
                            />

                            <div className=" gap-4 items-center mt-4 flex md:hidden">
                              <Button isIconOnly variant="faded">
                                <GoDownload
                                  fontSize={20}
                                  className="text-white"
                                />
                              </Button>
                              <Button isIconOnly variant="faded">
                                <MdOutlineBookmarkAdd
                                  fontSize={20}
                                  className="text-white"
                                />
                              </Button>
                              <Button isIconOnly color="danger" variant="faded">
                                <MdDeleteOutline
                                  fontSize={20}
                                  className="text-white"
                                />
                              </Button>
                            </div>
                          </>
                        )}
                        <div className="prompt mt-6">
                          <div className="head flex items-center">
                            <p>Prompt details</p>
                            <div className="cursor-pointer rounded-lg">
                              <Button
                                isIconOnly
                                variant="bordered"
                                onClick={() => setIsCopied(true)}
                                className="rounded-lg ml-2 border-none text-white"
                              >
                                {!isCopied ? (
                                  <GoCopy
                                    fontSize={18}
                                    className="text-white"
                                  />
                                ) : (
                                  <MdOutlineDone
                                    fontSize={18}
                                    className="text-white"
                                  />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="content mt-4 w-full md:max-w-[350px] text-sm bg-[#27272A] p-3 rounded-lg">
                            {Data?.prompt.length >= 90 ? (
                              <p>{Data?.prompt.slice(0, 90)}...</p>
                            ) : (
                              <p>{Data?.prompt}</p>
                            )}
                          </div>
                        </div>
                        <div className="more-details py-6 px-2 ">
                          <div className="first flex items-center justify-between">
                            <div className="dimension">
                              <p className="text-sm text-gray-500">
                                Resolution
                              </p>
                              <p className="text-sm mt-1">
                                {Data?.miscData?.dimensions}
                              </p>
                            </div>
                            <div className="created flex flex-col items-end">
                              <p className="text-sm text-gray-500">
                                Created At
                              </p>
                              <p className="text-sm mt-1">{formattedDate}</p>
                            </div>
                          </div>
                          <div className="second mt-4 flex items-center justify-between">
                            <div className="model">
                              <p className="text-sm text-gray-500">Model</p>
                              <div className="model-name flex items-center  mt-2">
                                <PiMagicWand
                                  fontSize={18}
                                  className="text-white mr-2"
                                />
                                <p className="text-sm">
                                  {Data?.miscData?.modelName}
                                </p>
                              </div>
                            </div>
                            <div className="category flex flex-col items-end">
                              <p className="text-sm text-gray-500">Category</p>
                              <p className="text-sm mt-2">Image tool</p>
                            </div>
                          </div>
                          <Button
                            color="primary"
                            variant="solid"
                            className="rounded-xl mt-10 w-full"
                          >
                            <RxUpload fontSize={21} className="text-white" />
                            Publish
                          </Button>
                        </div>
                      </div>
                    </div>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default RelatedImages;
