import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoriesSection from '@/components/CategoriesSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import BannerCarousel from '@/components/BannerCarousel';
import TrustBadges from '@/components/TrustBadges';
import ChatBot from '@/components/ChatBot';
import { AuthWrapper } from '@/components/Auth/AuthWrapper';


const Index = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const handleSearchChange = (term: string) => {
    console.log('📝 Index - Search term changed:', term);
    if (term.trim() !== '') {
      // Navigate to products page with search
      navigate(`/produtos?search=${encodeURIComponent(term.trim())}`);
    }
  };
  
  const handleCategoryChange = (category: string) => {
    console.log('📝 Index - Category changed:', category);
    if (category !== 'all') {
      // Navigate to products page with category
      navigate(`/produtos?categoria=${encodeURIComponent(category)}`);
    }
  };

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-background">
        <Header
          onAuthClick={() => navigate('/auth')}
          onAdminClick={() => navigate('/admin')}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
        />
        
        {/* Home page with all sections */}
        <BannerCarousel />
        <TrustBadges />
        <FeaturedProducts />
        <CategoriesSection onCategorySelect={handleCategoryChange} />
        
        <Footer />
        <ChatBot />
      </div>
    </AuthWrapper>
  );
};

export default Index;
