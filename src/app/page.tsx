"use client";

import { UserButton, useAuth, useUser } from "@clerk/nextjs";
import {
  Button,
  Modal,
  ModalContent,
  Spacer,
  useDisclosure,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  Input,
  Chip,
  Divider,
  Navbar,
} from "@nextui-org/react";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { FileUp, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { CldUploadButton } from "next-cloudinary";
import { Topic } from "@/util/type";
import TicketTopic from "./components/TicketTopic";

export default function Home() {
  // 使用 useDisclosure 钩子来管理模态框的打开和关闭状态
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // 使用 useState 钩子来管理内容、选项、当前选项和图片的状态
  const [content, setContent] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [currentOption, setCurrentOption] = useState("");
  const [images, setImages] = useState<string[]>([]);

  // 使用 useState 钩子来管理话题列表的状态
  const [topics, setTopics] = useState<Topic[]>([]);

  // 获取当前用户的 ID 和头像
  const { userId } = useAuth();
  const avatar = useUser().user?.imageUrl;

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`${process.env.API_ADDRESS}/topic`, {
        cache: "no-cache",
        method: "GET"
      });
      const data = await result.json();
      setTopics(data.topics as Topic[]);
    }
    fetchData();
  }, [])

  return (
    <div>
      <Navbar>
        <header className="w-full h-14">
          <div className="fixed top-4 right-8 flex justify-stretch items-center">
            <Button color="danger" variant="ghost" endContent={<Send />} onPress={onOpen}>
              发布
            </Button>
            <Spacer x={5} />
            <ThemeSwitcher />
            <Spacer x={5} />
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>
      </Navbar>
      <div className="flex items-center justify-center m-4">
        <main className="flex flex-col items-center justify-center w-full sm:w-full md:w-9/12 lg:w-6/12 ">   {/* border-x-2"> */}
          <h1 className="text-5xl font-bold">小破站</h1><br />
          <p className="text-lg">欢迎来到小破站，这里是你的个人博客，记录你的生活和工作。</p><br />
          <Spacer y={2} />
          <Divider className="my-4" />
          {topics && topics.map(topic => {
            return <TicketTopic {...topic} key={topic.id} />
          })}
        </main>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                发布话题
              </ModalHeader>
              <ModalBody>
                <Textarea
                  label="内容"
                  placeholder="写一篇话题吧！"
                  variant="underlined"
                  labelPlacement="outside"
                  value={content}
                  onValueChange={setContent}
                />
                <Spacer x={2} />
                <CldUploadButton
                  uploadPreset="mze0p1w2"
                  onSuccess={(result) => {
                    // @ts-ignore
                    setImages([...images, result.info.url]);
                  }}
                >
                  <button className="bg-secondary-400 hover:bg-secondary-700 text-white font-bold py-2 px-4 rounded-lg">
                    <div className="flex">
                      <FileUp />
                      <span>上传图片</span>
                    </div>
                  </button>
                </CldUploadButton>
                <Spacer x={2} />
                <div className="flex items-center">
                  <Input
                    label={"输入选项"}
                    variant={"underlined"}
                    size="sm"
                    value={currentOption}
                    onValueChange={setCurrentOption}
                  />
                  <Spacer y={2} />
                  <Button
                    color="success"
                    variant="light"
                    onClick={() => {
                      setOptions([
                        ...options,
                        currentOption,
                      ]);
                      setCurrentOption("");
                    }}
                  >
                    添加
                  </Button>
                </div>
                <Spacer x={2} />
                <div className="flex gap-2">
                  {options.map((item, index) => {
                    return (
                      <Chip
                        key={index}
                        onClose={(e) => {
                          setOptions(
                            options.filter(
                              (i) => i !== item
                            )
                          );
                        }}
                        variant="flat"
                      >
                        {item}
                      </Chip>
                    );
                  })}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                >
                  取消
                </Button>
                <Button
                  color="primary"
                  variant="light"
                  onPress={onClose}
                  onClick={async () => {
                    const result = await fetch(
                      process.env.API_ADDRESS + "/topic",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type":
                            "application/json",
                        },
                        body: JSON.stringify({
                          userId: userId,
                          avatar: avatar,
                          content: content,
                          images: images,
                          options: options,
                        }),
                      }
                    );

                    const data = (await result.json()) as Topic;
                    setTopics([...topics, data]);
                    setContent("");
                    setOptions([]);
                    setCurrentOption("");
                    setImages([]);
                  }}
                >
                  确定
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
