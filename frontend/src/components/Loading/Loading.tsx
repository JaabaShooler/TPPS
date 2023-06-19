import { Spin } from 'antd';

// eslint-disable-next-line import/no-extraneous-dependencies
import { LoadingOutlined } from '@ant-design/icons';

export type LoadingProps = {
  children?: React.ReactNode;
  loading: boolean;
  className?: string;
  size?: number;
  wrapperClassName?: string;
  isContainer?: boolean;
  style?: Record<string, string>;
};

const Loading: React.FunctionComponent<LoadingProps> = ({
  children,
  loading = false,
  className,
  style,
  wrapperClassName,
  // eslint-disable-next-line no-magic-numbers
  size = 48
}) => (
  <Spin
    spinning={loading}
    style={style}
    className={className}
    wrapperClassName={wrapperClassName}
    indicator={<LoadingOutlined spin style={{ fontSize: size }} />}
  >
    {children}
  </Spin>
);

export default Loading;
