import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductManagement } from '@/components/admin/ProductManagement';
import { OrderManagement } from '@/components/admin/OrderManagement';
import { FrameManagement } from '@/components/admin/FrameManagement';
import { SettingsManagement } from '@/components/admin/SettingsManagement';
import { SizeManagement } from '@/components/admin/SizeManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminPage = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage products and orders</p>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="frames">Frame Styles</TabsTrigger>
            <TabsTrigger value="sizes">Sizes</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="mt-6">
            <ProductManagement />
          </TabsContent>
          
          <TabsContent value="frames" className="mt-6">
            <FrameManagement />
          </TabsContent>
          
          <TabsContent value="sizes" className="mt-6">
            <SizeManagement />
          </TabsContent>
          
          <TabsContent value="orders" className="mt-6">
            <OrderManagement />
          </TabsContent>
          
          <TabsContent value="settings" className="mt-6">
            <SettingsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;