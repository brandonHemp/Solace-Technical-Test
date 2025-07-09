"use client";

import { Modal, Card, Descriptions, Tag, Avatar, Typography, Space, Divider, Row, Col, Button } from 'antd';
import { UserOutlined, PhoneOutlined, EnvironmentOutlined, BookOutlined, TrophyOutlined, CalendarOutlined } from '@ant-design/icons';
import { Advocate } from '../../hooks/useAdvocates';
import { formatPhoneNumber, formatDate, getInitials } from './utils';

const { Title, Text } = Typography;

export interface ProfileModalProps {
  advocate: Advocate | undefined;
  visible: boolean;
  onClose: () => void;
}

export default function ProfileModal({ advocate, visible, onClose }: ProfileModalProps) {

  const getExperienceColor = (years: number): string => {
    if (years < 2) return 'red';
    if (years < 5) return 'orange';
    if (years < 10) return 'blue';
    return 'green';
  };

  return (
    <>
      {advocate && (
        <Modal
          title={null}
          open={visible}
          onCancel={onClose}
          footer={[
            <Button key="close" onClick={onClose}>
              Close
            </Button>
          ]}
          width={700}
          styles={{
            body: { padding: '24px' }
          }}
        >
          <Card
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Row gutter={[16, 16]} align="middle" style={{ marginBottom: '24px' }}>
              <Col>
                <Avatar
                  size={80}
                  icon={<UserOutlined />}
                  style={{
                    backgroundColor: '#1890ff',
                    fontSize: '32px'
                  }}
                >
                  {getInitials(advocate.firstName, advocate.lastName)}
                </Avatar>
              </Col>
              <Col flex="auto">
                <Space direction="vertical" size="small">
                  <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                    {advocate.firstName} {advocate.lastName}
                  </Title>
                  <Text type="secondary" style={{ fontSize: '16px' }}>
                    <BookOutlined style={{ marginRight: '8px' }} />
                    {advocate.degree}
                  </Text>
                  <Text type="secondary" style={{ fontSize: '14px' }}>
                    <EnvironmentOutlined style={{ marginRight: '8px' }} />
                    {advocate.city}
                  </Text>
                </Space>
              </Col>
            </Row>

            <Divider />

            <Descriptions
              title="Basic Information"
              bordered
              column={2}
              size="middle"
              style={{ marginBottom: '24px' }}
            >
              <Descriptions.Item
                label={<><UserOutlined style={{ marginRight: '8px' }} />Full Name</>}
                span={2}
              >
                <Text strong>{advocate.firstName} {advocate.lastName}</Text>
              </Descriptions.Item>

              <Descriptions.Item
                label={<><PhoneOutlined style={{ marginRight: '8px' }} />Phone Number</>}
              >
                <Text copyable>{formatPhoneNumber(advocate.phoneNumber)}</Text>
              </Descriptions.Item>

              <Descriptions.Item
                label={<><EnvironmentOutlined style={{ marginRight: '8px' }} />City</>}
              >
                <Text>{advocate.city}</Text>
              </Descriptions.Item>

              <Descriptions.Item
                label={<><BookOutlined style={{ marginRight: '8px' }} />Degree</>}
              >
                <Text>{advocate.degree}</Text>
              </Descriptions.Item>

              <Descriptions.Item
                label={<><TrophyOutlined style={{ marginRight: '8px' }} />Experience</>}
              >
                <Tag color={getExperienceColor(advocate.yearsOfExperience)}>
                  {advocate.yearsOfExperience} {advocate.yearsOfExperience === 1 ? 'year' : 'years'}
                </Tag>
              </Descriptions.Item>

              {advocate.createdAt && (
                <Descriptions.Item
                  label={<><CalendarOutlined style={{ marginRight: '8px' }} />Member Since</>}
                  span={2}
                >
                  <Text>{formatDate(advocate.createdAt)}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>

            <div style={{ marginBottom: '16px' }}>
              <Title level={4} style={{ marginBottom: '12px', color: '#1890ff' }}>
                <TrophyOutlined style={{ marginRight: '8px' }} />
                Specialties ({advocate.specialties.length})
              </Title>
              <Space wrap>
                {advocate.specialties.map((specialty, index) => (
                  <Tag
                    key={index}
                    color="blue"
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '13px'
                    }}
                  >
                    {specialty}
                  </Tag>
                ))}
              </Space>
            </div>

            <Card
              size="small"
              style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '8px'
              }}
            >
              <Row gutter={[16, 8]}>
                <Col span={8}>
                  <Text type="secondary">Experience Level:</Text>
                  <br />
                  <Text strong>
                    {advocate.yearsOfExperience < 2 ? 'Junior' :
                      advocate.yearsOfExperience < 5 ? 'Mid-Level' :
                        advocate.yearsOfExperience < 10 ? 'Senior' : 'Expert'}
                  </Text>
                </Col>
                <Col span={8}>
                  <Text type="secondary">Location:</Text>
                  <br />
                  <Text strong>{advocate.city}</Text>
                </Col>
                <Col span={8}>
                  <Text type="secondary">Specialty Areas:</Text>
                  <br />
                  <Text strong>{advocate.specialties.length}</Text>
                </Col>
              </Row>
            </Card>
          </Card>
        </Modal>
      )}
    </>
  );
} 