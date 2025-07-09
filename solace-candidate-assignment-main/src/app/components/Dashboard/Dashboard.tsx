"use client";

import { Table, Typography, Space, Tag } from "antd";
import type { SortOrder } from "antd/es/table/interface";
import { useCallback } from "react";
import { Advocate } from "../../hooks/useAdvocates";

const { Text } = Typography;

interface DashboardProps {
  filteredAdvocates: Advocate[];
  filteredCount: number;
  isLoading: boolean;
  pagination: {
    page: number;
    pageSize: number;
  };
  sortOptions: {
    field: string;
    direction: 'asc' | 'desc';
  };
  onRowClick: (advocate: Advocate) => void;
  onPageChange: (page: number, pageSize?: number) => void;
  onPageSizeChange: (current: number, size: number) => void;
}

const formatPhoneNumber = (phoneNumber: number): string => {
  const phoneStr = phoneNumber.toString();
  if (phoneStr.length === 10) {
    return `(${phoneStr.slice(0, 3)}) ${phoneStr.slice(3, 6)}-${phoneStr.slice(6)}`;
  }
  return phoneStr;
};

// Component to render specialties with tags
const SpecialtiesRenderer = ({ specialties }: { specialties: string[] }) => (
  <Space wrap>
    {specialties.slice(0, 2).map((specialty, index) => (
      <Tag key={index} color="blue">
        {specialty}
      </Tag>
    ))}
    {specialties.length > 2 && (
      <Tag color="default">+{specialties.length - 2} more</Tag>
    )}
  </Space>
);

export default function Dashboard({
  filteredAdvocates,
  filteredCount,
  isLoading,
  pagination,
  sortOptions,
  onRowClick,
  onPageChange,
  onPageSizeChange
}: DashboardProps) {
  
  const handleRowClick = useCallback((advocate: Advocate) => {
    onRowClick(advocate);
  }, [onRowClick]);

  const getSortOrder = useCallback((field: string): SortOrder | undefined => {
    if (sortOptions.field === field) {
      return sortOptions.direction === 'asc' ? 'ascend' : 'descend';
    }
    return undefined;
  }, [sortOptions.field, sortOptions.direction]);

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
      sorter: true,
      sortOrder: getSortOrder('firstName'),
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      sorter: true,
      sortOrder: getSortOrder('lastName'),
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      sorter: true,
      sortOrder: getSortOrder('city'),
    },
    {
      title: 'Degree',
      dataIndex: 'degree',
      key: 'degree',
      sorter: true,
      sortOrder: getSortOrder('degree'),
    },
    {
      title: 'Specialties',
      dataIndex: 'specialties',
      key: 'specialties',
      render: (specialties: string[]) => <SpecialtiesRenderer specialties={specialties} />,
    },
    {
      title: 'Years of Experience',
      dataIndex: 'yearsOfExperience',
      key: 'yearsOfExperience',
      sorter: true,
      sortOrder: getSortOrder('yearsOfExperience'),
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: formatPhoneNumber,
    },
  ];

  const tableRowProps = (record: Advocate) => ({
    onClick: () => handleRowClick(record),
    style: { cursor: 'pointer' },
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5';
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      (e.currentTarget as HTMLElement).style.backgroundColor = '';
    },
  });

  const paginationConfig = {
    current: pagination.page,
    pageSize: pagination.pageSize,
    total: filteredCount,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number, range: [number, number]) =>
      `${range[0]}-${range[1]} of ${total} advocates`,
    pageSizeOptions: ['5', '10', '20', '50'],
    onChange: onPageChange,
    onShowSizeChange: onPageSizeChange,
  };

  return (
    <div>
      <Text type="secondary" style={{ marginBottom: '8px', display: 'block' }}>
        💡 Click on any row to view detailed advocate profile
      </Text>
      <Table
        columns={columns}
        dataSource={filteredAdvocates}
        rowKey={(record) => record.id.toString()}
        onRow={tableRowProps}
        pagination={paginationConfig}
        size="large"
        loading={isLoading}
      />
    </div>
  );
} 