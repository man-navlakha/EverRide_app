declare module 'react-native-spinkit' {
  import { Component } from 'react';
  import { ViewProps } from 'react-native';

  interface SpinnerProps extends ViewProps {
    type?: string;
    size?: number;
    color?: string;
    isVisible?: boolean;
  }

  export default class Spinner extends Component<SpinnerProps> {}
}
