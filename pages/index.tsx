import { createClient } from "@supabase/supabase-js";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/legacy/image";
import { useState } from "react";

type Image = {
	id: number;
	href: string;
	imageSrc: string;
	name: string;
	userName: string;
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

const Gallery: NextPage<{ images: Image[] }> = ({ images }: { images: Image[] }) => {
	return (
		<div className="max-w-2xl px-4 py-16 mx-auto sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
			<div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
				{images.map((image) => (
					<BlurImage key={image.id} image={image} />
				))}
			</div>
		</div>
	);
};

function BlurImage({ image }: { image: Image }) {
	const [isLoading, setLoading] = useState(true);

	return (
		<a href={image.href} className="group">
			<div className="w-full overflow-hidden bg-gray-200 rounded-lg aspect-w-1 aspect-h-1 xl:aspect-w-7 xl:aspect-h-8">
				<Image
					alt=""
					src={image.imageSrc}
					layout="fill"
					objectFit="cover"
					className={cn(
						"group-hover:opacity-75 duration-700 ease-in-out",
						isLoading ? "grayscale blur-2xl scale-110" : "grayscale-0 blur-0 scale-100"
					)}
					onLoadingComplete={() => setLoading(false)}
				/>
			</div>
			<h3 className="mt-4 text-sm text-gray-700">{image.name}</h3>
			<p className="mt-1 text-lg font-medium text-gray-900">{image.userName}</p>
		</a>
	);
}

export default Gallery;
