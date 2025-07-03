
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier: 'free' | 'basic' | 'premium' | 'elite';
  subscription_end?: string;
}

interface SubscriptionContextType {
  subscriptionData: SubscriptionData | null;
  loading: boolean;
  refreshSubscription: () => Promise<void>;
  isPremium: boolean;
  isBasic: boolean;
  isElite: boolean;
  user: User | null;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const refreshSubscription = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setSubscriptionData({ subscribed: false, subscription_tier: 'free' });
        setUser(null);
        return;
      }

      setUser(session.user);

      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error("Error checking subscription:", error);
        setSubscriptionData({ subscribed: false, subscription_tier: 'free' });
      } else {
        setSubscriptionData(data);
      }
    } catch (error) {
      console.error("Error refreshing subscription:", error);
      setSubscriptionData({ subscribed: false, subscription_tier: 'free' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSubscription();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        refreshSubscription();
      } else if (event === 'SIGNED_OUT') {
        setSubscriptionData({ subscribed: false, subscription_tier: 'free' });
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const isPremium = subscriptionData?.subscription_tier === 'premium' && subscriptionData?.subscribed;
  const isBasic = subscriptionData?.subscription_tier === 'basic' && subscriptionData?.subscribed;
  const isElite = subscriptionData?.subscription_tier === 'elite' && subscriptionData?.subscribed;

  return (
    <SubscriptionContext.Provider value={{
      subscriptionData,
      loading,
      refreshSubscription,
      isPremium,
      isBasic,
      isElite,
      user
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
