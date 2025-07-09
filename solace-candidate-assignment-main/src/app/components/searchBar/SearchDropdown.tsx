import { Card, Space, Typography, List } from "antd";
import { Advocate } from "../../hooks/useAdvocates";

const { Text } = Typography;

interface SearchDropdownProps {
  visible: boolean;
  searchResults: Advocate[];
  searchQuery: string;
  onAdvocateSelect: (advocate: Advocate) => void;
}

export default function SearchDropdown({
  visible,
  searchResults,
  searchQuery,
  onAdvocateSelect
}: SearchDropdownProps) {
  if (!visible || searchResults.length === 0) {
    return null;
  }

  const getResultsHeader = () => {
    if (!searchQuery.trim()) {
      return 'Top Advocates by Specialties';
    }
    if (searchQuery.length <= 3) {
      return `Cache Results (${searchResults.length} found)`;
    }
    return `Database Results (${searchResults.length} found)`;
  };

  return (
    <Card
      size="small"
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 200,
        zIndex: 1000,
        maxHeight: '300px',
        overflowY: 'auto',
        marginTop: '4px'
      }}
    >
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <Text strong style={{ fontSize: '12px', color: '#666' }}>
          {getResultsHeader()}
        </Text>
        <List
          size="small"
          dataSource={searchResults}
          renderItem={(advocate) => (
            <List.Item
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0'
              }}
              onClick={() => onAdvocateSelect(advocate)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Space direction="vertical" size="small" style={{ width: "100%" }}>
                <Text style={{ fontWeight: 500 }}>
                  {advocate.firstName} {advocate.lastName}
                </Text>
                <Text style={{ fontSize: '12px', color: '#666' }}>
                  {advocate.city} • {advocate.degree}
                </Text>
                <Text style={{ fontSize: '11px', color: '#999' }}>
                  {advocate.specialties.join(', ')} ({advocate.specialties.length} specialties)
                </Text>
              </Space>
            </List.Item>
          )}
        />
      </Space>
    </Card>
  );
} 