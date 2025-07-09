import { NextRequest, NextResponse } from 'next/server';
import { advocates } from '../../../../db/schema';
import { withDbConnection } from '../../../../db/connection';
import { sql } from 'drizzle-orm';

// Helper function to apply role-based filtering
const applyRoleBasedFiltering = (advocateData: any[], userRole: string, username: string) => {
  if (userRole === 'ADMIN') {
    return advocateData;
  }

  if (userRole === 'ADVOCATE') {

    return advocateData.filter(advocate =>
      advocate.firstName.toLowerCase() === username.toLowerCase())
  }

  return advocateData;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const topFive = searchParams.get('topFive');
    const limit = parseInt(searchParams.get('limit') || '10');

    const userRole = searchParams.get('userrole') || '';
    const username = searchParams.get('username') || '';

    if (!userRole || !username) {

    }


    if (topFive === 'true') {
      const result = await withDbConnection(async (db) => {

        const topAdvocates = await db
          .select()
          .from(advocates)
          .orderBy(sql`
            CASE 
              WHEN jsonb_typeof(${advocates.specialties}) = 'array' 
              THEN jsonb_array_length(${advocates.specialties})
              ELSE 0
            END DESC
          `)
          .limit(5);

        // Apply role-based filtering
        const filteredAdvocates = applyRoleBasedFiltering(topAdvocates, userRole, username);

        return filteredAdvocates?.slice(0, 5);
      });

      return NextResponse.json({
        success: true,
        data: result,
        message: 'Top 5 advocates by specialty count fetched successfully'
      });
    }

    const result = await withDbConnection(async (db) => {
      const searchTerm = `%${query?.trim()}%`;

      const searchResults = await db
        .select()
        .from(advocates)
        .where(
          sql`(
            ${advocates.firstName} ILIKE ${searchTerm} OR 
            ${advocates.lastName} ILIKE ${searchTerm} OR 
            ${advocates.city} ILIKE ${searchTerm} OR 
            ${advocates.degree} ILIKE ${searchTerm} OR
            ${advocates.specialties}::text ILIKE ${searchTerm}
          )`
        )
        .limit(limit);

      // Apply role-based filtering
      return applyRoleBasedFiltering(searchResults, userRole, username);
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Search completed successfully'
    });
  } catch (error) {

    // Handle topFive fallback
    const topFive = new URL(request.url).searchParams.get('topFive');
    if (topFive === 'true') {
      const topFiveFallback = [
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          city: "New York",
          degree: "MD",
          specialties: ["General Mental Health", "Anxiety", "Depression", "Trauma & PTSD"],
          yearsOfExperience: 10,
          phoneNumber: 5551234567,
        },
        {
          id: 2,
          firstName: "Jane",
          lastName: "Smith",
          city: "Los Angeles",
          degree: "PhD",
          specialties: ["Trauma & PTSD", "Substance abuse", "Anxiety"],
          yearsOfExperience: 8,
          phoneNumber: 5559876543,
        },
        {
          id: 3,
          firstName: "Dr. Emily",
          lastName: "Johnson",
          city: "Chicago",
          degree: "PsyD",
          specialties: ["Child Psychology", "Family Therapy"],
          yearsOfExperience: 12,
          phoneNumber: 5551112233,
        },
        {
          id: 4,
          firstName: "Michael",
          lastName: "Brown",
          city: "Houston",
          degree: "LCSW",
          specialties: ["Couples Therapy"],
          yearsOfExperience: 6,
          phoneNumber: 5554445566,
        },
        {
          id: 5,
          firstName: "Sarah",
          lastName: "Davis",
          city: "Phoenix",
          degree: "MA",
          specialties: ["Depression"],
          yearsOfExperience: 4,
          phoneNumber: 5557778899,
        }
      ];

      const sortedTopFive = topFiveFallback.sort((a, b) => b.specialties.length - a.specialties.length);
      const userRole = new URL(request.url).searchParams.get('userrole') || '';
      const username = new URL(request.url).searchParams.get('username') || '';

      //apply role-based filtering
      const filteredFallback = applyRoleBasedFiltering(sortedTopFive, userRole, username);


      return NextResponse.json({
        success: true,
        data: filteredFallback,
        message: 'Top 5 advocates by specialty count fetched successfully (fallback data)'
      });
    }

    // Fallback data for search TODO: make better
    const fallbackData = [
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        city: "New York",
        degree: "MD",
        specialties: ["General Mental Health", "Anxiety", "Depression"],
        yearsOfExperience: 10,
        phoneNumber: 5551234567,
      },
      {
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
        city: "Los Angeles",
        degree: "PhD",
        specialties: ["Trauma & PTSD", "Substance abuse"],
        yearsOfExperience: 8,
        phoneNumber: 5559876543,
      },
    ];

    const query = new URL(request.url).searchParams.get('query');
    const limit = parseInt(new URL(request.url).searchParams.get('limit') || '10');

    if (!query || query.trim().length <= 4) {
      return NextResponse.json({
        success: false,
        message: 'Search query must be more than 4 characters',
        data: []
      });
    }

    // Simple fallback search with role-based filtering
    const searchTerm = query.toLowerCase();
    const filteredFallback = fallbackData.filter(advocate =>
      advocate.firstName.toLowerCase().includes(searchTerm) ||
      advocate.lastName.toLowerCase().includes(searchTerm) ||
      advocate.city.toLowerCase().includes(searchTerm) ||
      advocate.degree.toLowerCase().includes(searchTerm) ||
      advocate.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm))
    );

    const userRole = new URL(request.url).searchParams.get('userrole') || '';
    const username = new URL(request.url).searchParams.get('username') || '';
    const roleFilteredFallback = applyRoleBasedFiltering(filteredFallback, userRole, username);

    return NextResponse.json({
      success: true,
      data: roleFilteredFallback.slice(0, limit),
      message: 'Search completed successfully (fallback data)'
    });
  }
} 