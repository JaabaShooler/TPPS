import {
  Button,
  Card,
  Dropdown,
  Empty,
  MenuProps,
  message,
  Modal,
  Popover,
  Skeleton,
  Space
} from 'antd';
import useAxios from 'axios-hooks';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { DownOutlined, EllipsisOutlined } from '@ant-design/icons';

// @ts-ignore
import image from '../../assets/pngegg.png';
import Loading from '../../components/Loading/Loading.tsx';
import { ROUTES } from '../../constants.ts';

import AddFileModal from './components/modals/AddFileModal.tsx';

// @ts-ignore
import styles from './Main.module.scss';

const { Meta } = Card;

interface File {
  id: number;
  fileName: string;
  originalName: string;
  size: number;
  mimeType: string;
  deletedAt: null;
}

interface MainResponse<T> {
  data: T;
  success: boolean;
}

function isImage(mimeType: string): boolean {
  const imageTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp']; // Список MIME-типов изображений

  return imageTypes.includes(mimeType);
}

function getLastSubstringAfterDot(str: string): string {
  const dotIndex: number = str.lastIndexOf('.');

  if (dotIndex !== -1 && dotIndex < str.length - 1) {
    return str.substring(dotIndex + 1);
  }

  return '';
}

const items: MenuProps['items'] = [
  {
    label: 'All',
    key: 'all'
  },
  {
    label: 'Images',
    key: 'photos'
  },
  {
    type: 'divider'
  },
  {
    label: 'Deleted',
    key: 'trash'
  }
];

const Main = () => {
  const navigate = useNavigate();
  const [isOpenAddModal, setIsOpenAddModal] = useState<boolean>(false);
  const [type, setType] = useState<string>('all');
  const [{ data: getFilesData, loading: getFilesLoading }, getFiles] = useAxios<
    MainResponse<File[]>
  >({
    url: `/files?type=${type}`,
    method: 'GET'
  });

  const [, deleteFile] = useAxios(
    {
      url: '/files',
      method: 'DELETE'
    },
    {
      manual: true
    }
  );

  const handleOnCloseModal = () => {
    getFiles();
    setIsOpenAddModal(false);
  };

  const handleOnSendFile = () => {
    setIsOpenAddModal(false);
  };

  const handlerDeleteForm = async (id: number) => {
    try {
      await deleteFile({ url: `/files?id=${id}` });
      message.success('File deleted successfully!');
    } catch (err) {
      console.error(err);
      message.error('Something went wrong!');
    }
    handleOnCloseModal();
  };

  const data = getFilesData?.data;

  const warning = (id: number) => () => {
    Modal.warning({
      title: 'Deleting the file',
      content: 'Are you sure you want to delete this file',
      onOk: async () => {
        await handlerDeleteForm(id);
      }
    });
  };

  const onTypeClick: MenuProps['onClick'] = ({ key }) => {
    getFiles();
    setType(key);
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate(ROUTES.LOGIN);
  };

  return (
    <div>
      <Space className={styles['main-header']}>
        <Button type='primary' block onClick={() => setIsOpenAddModal(true)}>
          Add file
        </Button>
        <div className={styles['main-header-menu']}>
          <Dropdown menu={{ items, onClick: onTypeClick }} trigger={['click']}>
            <Space>
              Show: {type}
              <DownOutlined />
            </Space>
          </Dropdown>
          <Button danger onClick={logout}>
            Logout
          </Button>
        </div>
      </Space>
      <Loading loading={getFilesLoading}>
        <div className={styles.main}>
          {data?.length ? (
            <Space size={16} wrap>
              {data?.map((item) => (
                <Card
                  key={item.id}
                  bordered
                  hoverable
                  style={{ width: 240 }}
                  actions={[
                    <Popover
                      placement='bottom'
                      title='Actions'
                      content={
                        <div>
                          <Link
                            to={`http://localhost:5000/uploads/${item.fileName}`}
                            target='_blank'
                            rel='noopener noreferrer'
                          >
                            <Button style={{ width: '100%' }} type='link'>
                              Follow to the file
                            </Button>
                          </Link>
                          <Button
                            style={{ width: '100%' }}
                            type='text'
                            danger
                            onClick={warning(item.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      }
                      trigger='click'
                    >
                      <EllipsisOutlined key='ellipsis' />
                    </Popover>
                  ]}
                  cover={
                    <img
                      alt='example'
                      src={
                        isImage(item.mimeType)
                          ? `http://localhost:5000/uploads/${item.fileName}`
                          : image
                      }
                    />
                  }
                >
                  <Skeleton loading={getFilesLoading} active>
                    <Meta title={item.originalName} />
                  </Skeleton>
                </Card>
              ))}
            </Space>
          ) : (
            <Empty />
          )}
        </div>
      </Loading>
      <AddFileModal
        handleCancel={handleOnCloseModal}
        handleOk={handleOnSendFile}
        isOpenAddModal={isOpenAddModal}
      />
    </div>
  );
};

export default Main;
