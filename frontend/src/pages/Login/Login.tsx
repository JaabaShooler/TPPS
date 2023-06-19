import { Button, Form, Input, message, Space } from 'antd';
import useAxios from 'axios-hooks';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '../../constants.ts';

// @ts-ignore
import styles from './Login.module.scss';

type UserLogin = { email: string; password: string };
const Login = () => {
  const navigate = useNavigate();
  const [{ loading }, fetch] = useAxios(
    {
      url: '/auth/login',
      method: 'POST'
    },
    {
      manual: true
    }
  );
  const onFinish = async (values: UserLogin) => {
    try {
      const { data } = await fetch({ data: values });
      localStorage.setItem('token', data.data.token);
      navigate(ROUTES.MAIN, { replace: true });
    } catch (errorInfo) {
      // @ts-ignore
      message.error(errorInfo.toString());
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error(errorInfo.toString());
  };

  return (
    <div className={styles.main}>
      <Space className={styles['main-form']}>
        <Form
          name='basic'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 800 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <Form.Item
            label='Email'
            name='email'
            rules={[
              { type: 'email', message: 'Please a valid email!' },
              {
                required: true,
                message: 'Please input your email!'
              }
            ]}
          >
            <Input maxLength={30} showCount />
          </Form.Item>

          <Form.Item
            label='Password'
            name='password'
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password maxLength={30} />
          </Form.Item>

          <Form.Item className={styles['main-form-item']}>
            <Button type='primary' htmlType='submit' loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </div>
  );
};

export default Login;
