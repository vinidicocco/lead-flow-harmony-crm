import { Tenant } from '@/types';
import { supabase } from "@/integrations/supabase/client";

// Map organization IDs to tenant values
export const organizationToTenant: Record<string, Tenant> = {
  // Add mappings for your organizations here
  // Example: "123e4567-e89b-12d3-a456-426614174000": "SALT_GHF"
};

// Get tenant based on organization ID
export const getTenantByOrganizationId = async (organizationId: string | null): Promise<Tenant> => {
  if (!organizationId) return 'SALT_GHF'; // Default tenant
  
  // If we have a specific mapping for this organization, use it
  if (organizationToTenant[organizationId]) {
    return organizationToTenant[organizationId];
  }
  
  // Otherwise, fetch the organization code to determine tenant
  const { data: orgData } = await supabase
    .from('organizations')
    .select('code')
    .eq('id', organizationId)
    .maybeSingle();
  
  // Map organization code to tenant
  if (orgData?.code === 'NEOIN') {
    return 'NEOIN';
  }
  
  return 'SALT_GHF'; // Default for all other organizations
};
