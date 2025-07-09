"use client";

import { Input, Button, Space, Spin, Typography, Flex } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { useCallback, useState } from "react";
import { Advocate, useAdvocates } from "../../hooks/useAdvocates";
import { useSimpleSearch } from "./useSimpleSearch";
import ProfileModal from "../profileModal/ProfileModal";
import SearchDropdown from "./SearchDropdown";

const { Text } = Typography;

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAdvocate, setSelectedAdvocate] = useState<Advocate>();
  const [modalVisible, setModalVisible] = useState(false);

  const { clearFilters, refresh, filteredAdvocates } = useAdvocates();
  const { 
    searchResults, 
    searchLoading, 
    showDropdown, 
    handleSearch, 
    clearSearchResults, 
    setShowDropdown 
  } = useSimpleSearch();

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleSearch(value, filteredAdvocates);
  }, [handleSearch, filteredAdvocates]);

  const handleClearAll = useCallback(() => {
    setSearchQuery('');
    clearSearchResults();
    clearFilters();
  }, [clearSearchResults, clearFilters]);

  const handleRefresh = useCallback(() => {
    setSearchQuery('');
    clearSearchResults();
    refresh();
  }, [refresh, clearSearchResults]);

  const handleAdvocateSelect = useCallback((advocate: Advocate) => {
    setShowDropdown(false);
    setSelectedAdvocate(advocate);
    setModalVisible(true);
    setSearchQuery(`${advocate.firstName} ${advocate.lastName}`);
  }, [setShowDropdown]);

  const handleModalClose = useCallback(() => {
    setModalVisible(false);
    setSelectedAdvocate(undefined);
  }, []);

  const handleInputFocus = useCallback(() => {
    if (searchResults.length > 0) {
      setShowDropdown(true);
    }
  }, [searchResults.length, setShowDropdown]);

  const handleInputBlur = useCallback(() => {
    setTimeout(() => setShowDropdown(false), 200);
  }, [setShowDropdown]);

  return (
    <>
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <Flex style={{ position: 'relative', width: "100%" }}>
          <Space.Compact style={{ width: "100%" }}>
            <Input
              placeholder="Search by name, city, degree, or specialties... (1-3 chars: cache, 4+ chars: database)"
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              style={{ width: "calc(100% - 200px)" }}
            />
            <Button
              type="default"
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              style={{ width: "80px" }}
            >
              Refresh
            </Button>
            <Button
              type="default"
              onClick={handleClearAll}
              style={{ width: "120px" }}
            >
              Clear All
            </Button>
          </Space.Compact>

          <SearchDropdown
            visible={showDropdown}
            searchResults={searchResults}
            searchQuery={searchQuery}
            onAdvocateSelect={handleAdvocateSelect}
          />
        </Flex>

        {searchLoading && (
          <Flex align="center" gap="small" style={{ padding: '8px 0' }}>
            <Spin size="small" />
            <Text type="secondary">Searching database...</Text>
          </Flex>
        )}
      </Space>

      <ProfileModal
        advocate={selectedAdvocate}
        visible={modalVisible}
        onClose={handleModalClose}
      />
    </>
  );
}