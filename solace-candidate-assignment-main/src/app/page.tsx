"use client";

import { Button, Card, Typography, Space, Select } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/authContext";
import { useAdvocates } from "./hooks/useAdvocates";
import { useAdvocateModal } from "./hooks/useAdvocateModal";
import { useCallback } from "react";
import SearchBar from "./components/searchBar";
import ProfileModal from "./components/profileModal/ProfileModal";
import Dashboard from "./components/Dashboard";

const { Title, Text } = Typography;
const { Option } = Select;

const getRoleDescription = (isAdmin?: boolean, isAdvocate?: boolean, isUser?: boolean) => {
  if (isAdmin) return "You have admin access and can view all advocates.";
  if (isAdvocate) return "You have advocate access and can only view advocates whose first name matches your username.";
  if (isUser) return "You have user access and can view all advocates.";
  return "Unknown role";
};

const getRoleColor = (isAdmin?: boolean, isAdvocate?: boolean, isUser?: boolean) => {
  if (isAdmin) return "#52c41a"; // Green
  if (isAdvocate) return "#1890ff"; // Blue
  if (isUser) return "#faad14"; // Orange
  return "#d9d9d9"; // Gray
};

export default function Home() {
  const auth = useAuth();
  const { user, logout, isAdmin, isAdvocate, isUser } = auth || {};

  const modal = useAdvocateModal();

  const {
    totalCount,
    filteredAdvocates,
    filteredCount,
    isLoading,
    pagination,
    totalPages,
    filters,
    sortOptions,
    setPage,
    setPageSize,
    setFilters,
    getUniqueValues,
  } = useAdvocates(
    {},
    {},
    { field: 'firstName', direction: 'asc' }
  );

  const handlePageChange = useCallback((page: number, pageSize?: number) => {
    if (page !== pagination.page) {
      setPage(page);
    }
    if (pageSize && pageSize !== pagination.pageSize) {
      setPageSize(pageSize);
    }
  }, [pagination, setPage, setPageSize]);

  const handlePageSizeChange = useCallback((current: number, size: number) => {
    setPageSize(size);
  }, [setPageSize]);

  const uniqueCities = getUniqueValues('city');
  const uniqueDegrees = getUniqueValues('degree');
  const uniqueSpecialties = getUniqueValues('specialties');

  return (
    <ProtectedRoute>
      <div style={{ margin: "24px" }}>
        {/* Header Card */}
        <Card style={{ marginBottom: "24px" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div>
              <Title level={2} style={{ margin: 0 }}>
                Solace Advocates
              </Title>
              {user && (
                <Space direction="vertical" size="small">
                  <Text type="secondary">
                    Welcome, {user.username}
                  </Text>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Text strong style={{ color: getRoleColor(isAdmin, isAdvocate, isUser) }}>
                      Role: {user.role}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      ({getRoleDescription(isAdmin, isAdvocate, isUser)})
                    </Text>
                  </div>
                </Space>
              )}
            </div>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </Card>

        {/* Main Content Card */}
        <Card>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            {/* Statistics and Search */}
            <div>
              <Title level={4}>Search & Filter Advocates</Title>
              <div style={{ marginBottom: '8px' }}>
                <Text type="secondary">
                  Showing {filteredCount || 0} of {totalCount || 0} advocates
                  {filteredCount !== totalCount && ` (filtered)`}
                </Text>
                {isAdvocate && (
                  <Text type="secondary" style={{ marginLeft: '16px', fontSize: '12px', color: '#1890ff' }}>
                    • As an advocate user, you can only see advocates whose first name matches your username
                  </Text>
                )}
              </div>
              <div style={{ marginTop: '8px' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Debug: Page {pagination.page} of {totalPages} | Page Size: {pagination.pageSize} | Total: {filteredCount || 0}
                </Text>
              </div>
            </div>

            {/* Search Bar */}
            <SearchBar />

            {/* Filter Controls */}
            <Space wrap>
              <Select
                placeholder="Filter by city"
                value={filters.city}
                onChange={(value) => setFilters({ city: value })}
                style={{ width: 150 }}
                allowClear
              >
                {uniqueCities.map(city => (
                  <Option key={city} value={city}>{city}</Option>
                ))}
              </Select>

              <Select
                placeholder="Filter by degree"
                value={filters.degree}
                onChange={(value) => setFilters({ degree: value })}
                style={{ width: 150 }}
                allowClear
              >
                {uniqueDegrees.map(degree => (
                  <Option key={degree} value={degree}>{degree}</Option>
                ))}
              </Select>

              <Select
                placeholder="Filter by specialties"
                mode="multiple"
                value={filters.specialties}
                onChange={(value) => setFilters({ specialties: value })}
                style={{ width: 200 }}
                allowClear
              >
                {uniqueSpecialties.map(specialty => (
                  <Option key={specialty} value={specialty}>{specialty}</Option>
                ))}
              </Select>
            </Space>

            {/* Dashboard Table */}
            <Dashboard
              filteredAdvocates={filteredAdvocates}
              filteredCount={filteredCount || 0}
              isLoading={isLoading}
              pagination={pagination}
              sortOptions={sortOptions}
              onRowClick={modal.openModal}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </Space>
        </Card>

        {/* Profile Modal */}
        <ProfileModal
          advocate={modal.selectedAdvocate}
          visible={modal.modalVisible}
          onClose={modal.closeModal}
        />
      </div>
    </ProtectedRoute>
  );
}
