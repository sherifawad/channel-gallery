import { createClient } from "@supabase/supabase-js";
import type { NextPage } from "next";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { sendForm } from "./api/checklink";
import RingLoader from "react-spinners/RingLoader";

type Image = {
    id: number;
    href: string;
    imageSrc: string;
    name: string;
    userName: string;
    updated_at: Date;
};

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function getStaticProps() {
    const { data } = await supabaseAdmin.from("images").select("*");
    return {
        props: {
            images: data,
        },
    };
}

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

const Gallery: NextPage<{ images: Image[] }> = ({
    images,
}: {
    images: Image[];
}) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);
    const sendEmail = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        try {
            if (!value.trim().startsWith("https://www.youtube.com")) {
                setValue("");
                setErrorMessage("اضف يوتيوب فقط");
                setLoading(false);
                return;
            }

            if (value.trim().startsWith("https://www.youtube.com/watch?v=")) {
                setValue("");
                setErrorMessage("اضف لينك القناة و ليس رابط فيديو");
                setLoading(false);
                return;
            }
            const result = await sendForm(value);
            if (result.status === 200) {
                setValue("");
                setErrorMessage("");
                setLoading(false);
                alert("تم");
                return;
            }
            setLoading(false);
            setErrorMessage("لينك غير صحيح");
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="bg-gray-200">
            <div className="px-4">
                <h1 className="pt-16 text-3xl text-center text-black">
                    فرغ نفسك ساعة يوميا لمشروع دعوة إلى الله
                </h1>
            </div>
            <div className="max-w-2xl px-4 py-16 mx-auto sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {images?.map((image, index) => (
                        <BlurImage
                            key={image.id}
                            image={image}
                            priority={index === 0 ? true : false}
                        />
                    ))}
                </div>
            </div>
            <div
                dir="rtl"
                className="flex items-center justify-center max-w-2xl px-4 mx-auto mb-4 "
            >
                <form
                    onSubmit={sendEmail}
                    className="w-full pt-2 bg-gray-100 rounded-lg shadow-lg"
                >
                    <div className="flex flex-wrap mb-6 ">
                        <h2 className="px-4 pt-3 pb-2 text-lg text-gray-800">
                            اقترح قناة
                        </h2>
                        <div className="w-full px-3 mt-2 mb-2 md:w-full relative">
                            <input
                                value={value}
                                onChange={(e) => {
                                    setValue(e.target.value);
                                    setErrorMessage("");
                                }}
                                className="w-full px-3 py-2 font-medium leading-normal text-left placeholder-gray-700 bg-gray-100 border border-gray-400 rounded resize-none focus:outline-none focus:bg-white"
                                name="message"
                                placeholder="رابط القناة"
                                required
                            ></input>
                            <div className="absolute block">
                                <RingLoader color="#36d7b7" loading={loading} />
                            </div>
                        </div>
                        <div className="flex items-center justify-between w-full px-3 ">
                            <div className="-mr-1 grid">
                                <input
                                    disabled={loading}
                                    type="submit"
                                    className={`px-4 py-1 mr-1 font-medium tracking-wide text-gray-700 bg-white border border-gray-400 rounded-lg ${
                                        loading ? "" : "hover:bg-gray-100"
                                    } `}
                                    value="ارسل ا قتراحك"
                                />
                            </div>
                            {errorMessage.length > 2 ? (
                                <div className="flex items-center px-2 text-gray-700">
                                    <p className="pt-px text-xs md:text-sm text-red-700">
                                        {errorMessage}
                                    </p>
                                    <svg
                                        fill="none"
                                        className="w-5 h-5 mr-1 text-red-700"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

function BlurImage({
    image,
    priority = false,
}: {
    image: Image;
    priority?: boolean;
}) {
    const [isLoading, setLoading] = useState(true);

    return (
        <a href={image.href} className="group">
            <div className="w-full overflow-hidden bg-gray-200 rounded-lg aspect-w-1 aspect-h-1 xl:aspect-w-7 xl:aspect-h-8">
                <Image
                    priority={priority}
                    alt=""
                    src={image.imageSrc}
                    width={336}
                    height={188}
                    sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
                    className={cn(
                        "group-hover:opacity-75 duration-700 ease-in-out",
                        isLoading
                            ? "grayscale blur-2xl scale-110"
                            : "grayscale-0 blur-0 scale-100"
                    )}
                    onLoadingComplete={() => setLoading(false)}
                />
            </div>
            <h3 className="mt-4 text-sm text-gray-700">{image.name}</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">
                {image.userName}
            </p>
        </a>
    );
}

export default Gallery;
