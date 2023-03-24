import { createClient } from "@supabase/supabase-js";
import type { NextPage } from "next";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { sendForm } from "./api/checklink";

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
    const sendEmail = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const target = e.target as typeof e.target &
                HTMLFormElement & {
                    message: { value: string };
                };
            alert("تم");
            if (
                !target.message.value
                    .trim()
                    .startsWith("https://www.youtube.com") ||
                target.message.value
                    .trim()
                    .startsWith("https://www.youtube.com/watch?v=")
            ) {
                target.reset();
                return;
            }
            await sendForm(target.message.value);
            target.reset();
        } catch (error) {}
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
                        <div className="w-full px-3 mt-2 mb-2 md:w-full">
                            <input
                                className="w-full px-3 py-2 font-medium leading-normal text-left placeholder-gray-700 bg-gray-100 border border-gray-400 rounded resize-none focus:outline-none focus:bg-white"
                                name="message"
                                placeholder="رابط القناة"
                                required
                            ></input>
                        </div>
                        <div className="flex items-start w-full px-3 md:w-full">
                            {/* <div className="flex items-start w-1/2 px-2 mr-auto text-gray-700">
                                <svg
                                    fill="none"
                                    className="w-5 h-5 mr-1 text-gray-600"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <p className="pt-px text-xs md:text-sm">
                                    Some HTML is okay.
                                </p>
                            </div> */}
                            <div className="-mr-1">
                                <input
                                    type="submit"
                                    className="px-4 py-1 mr-1 font-medium tracking-wide text-gray-700 bg-white border border-gray-400 rounded-lg hover:bg-gray-100"
                                    value="ارسل اقتراحك"
                                />
                            </div>
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
