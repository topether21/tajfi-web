/** @type {import('next').NextConfig} */
const nextConfig = {
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
	images: {
		domains: ["placehold.co", "raw.githubusercontent.com"],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "placehold.co",
			},
			{
				protocol: "https",
				hostname: "raw.githubusercontent.com",
			},
			{
				protocol: "https",
				hostname: "img.itch.zone",
			},
		],
		// localPatterns: [
		// 	{
		// 		pathname: "/assets/images/**",
		// 		search: "",
		// 	},
		// ],
	},
};

export default nextConfig;
