import React from "react";
import Hero from "../components/home/Hero";
import CategorySection from "../components/home/CategorySection";
import ProductGrid from "../components/product/ProductGrid";
import Features from "../components/home/Features";
import Newsletter from "../components/home/NewsLetter";

const Home = () => {
  return (
    <>
      <Hero />
      <CategorySection />
      <ProductGrid />
      <Features />
      <Newsletter />
    </>
  );
};

export default Home;