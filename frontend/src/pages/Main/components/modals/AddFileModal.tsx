import type { UploadFile, UploadProps } from 'antd';
import { message, Modal, Upload } from 'antd';
import { RcFile } from 'antd/es/upload';
import useAxios from 'axios-hooks';
import React, { useState } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

interface AddFileModalProps {
  isOpenAddModal: boolean;
  handleOk?: () => void;
  handleCancel: () => void;
}

const AddFileModal = ({ isOpenAddModal, handleCancel }: AddFileModalProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const [{ loading }, uploadFile] = useAxios(
    {
      url: '/files',
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    },
    {
      manual: true
    }
  );
  const handleUpload = async () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append('file', file as RcFile);
    });

    setUploading(true);
    try {
      const res = await uploadFile({ data: formData }, {});
      setFileList([]);
      setUploading(false);
      message.success('upload successfully.');
      handleCancel();
    } catch (e) {
      message.error('upload failed.');
      setUploading(false);
    }
  };

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);

      return false;
    },
    fileList,
    multiple: true
  };

  return (
    <Modal
      title='Add a new file'
      open={isOpenAddModal}
      onOk={handleUpload}
      onCancel={handleCancel}
      confirmLoading={uploading || loading}
    >
      <Dragger {...props}>
        <p className='ant-upload-drag-icon'>
          <InboxOutlined />
        </p>
        <p className='ant-upload-text'>Click or drag file to this area to upload</p>
        <p className='ant-upload-hint'>
          Support for a single or bulk upload. Strictly prohibited from uploading company data or
          other banned files.
        </p>
      </Dragger>
    </Modal>
  );
};

export default AddFileModal;
