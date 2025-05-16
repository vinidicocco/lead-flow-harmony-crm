import { Tenant } from '@/types';
import { dbService } from '@/integrations/appwrite/database';

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
  try {
    const orgData = await dbService.organizations.getById(organizationId);
    
    // Map organization code to tenant
    if (orgData && orgData.code === 'NEOIN') {
      return 'NEOIN';
    }
  } catch (error) {
    console.error('Error fetching organization:', error);
  }
  
  return 'SALT_GHF'; // Default for all other organizations
};
