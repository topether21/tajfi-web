'use client';
import { ModernAssetMarketplace } from "@/components/containers/home/home";

const fetchData = async () => {
  const data = {};
  return data;
};

const Home = async () => {
  const data = await fetchData();

  return (
    <ModernAssetMarketplace data={data} />
  );
};

export default Home;
