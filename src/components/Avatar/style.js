import styled from 'styled-components/native';

export const GithuFork = styled.View`
  width: 12.1em;
  height: 12.1em;
  position: absolute;
  overflow: hidden;
  top: 0;
  right: 0;
  z-index: 9999;
  pointer-events: none;
`;

export const Container = styled.View`
  position: relative;
  border-radius: 8px;
  width: 400px;
  margin: auto;
  background: #f3f3f3;
  margin-top: 20px;
  padding: 20px 0;
`;

export const Pieces = styled.View`
  display: inline-block;
  position: relative;
  overflow: hidden;
`;

export const Color = styled.View`
  display: inline-block;
  height: 26px;
  width: 23px;
`;

export const None = styled.View`
  opacity: 0.2;
  font-size: 11px;
  position: absolute;
  top: 20px;
  left: 9px;
`;

export const StyledAvatar = styled.View`
  display: block;
  width: 315px;
  height: 235px;
  padding-left: 20px;
`;

export const Tab = styled.View`
  font-size: 12px;
  text-align: center;
  border: 1px solid transparent;
  padding: 4px;
  border-radius: 4px;
`;

export const Tabpane = styled.View`
  box-sizing: border-box;
  display: none;
  width: 400px;
  padding: 0 10px 10px;
`;

export const DownloadRow = styled.View`
  text-align: center;
`;

export const Tabs = styled.View`
  box-sizing: border-box;
  display: block;
  position: absolute;
  right: 50px;
  top: 8px;
  width: 100px;
`;

export const ColorContainer = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

export const Tabpanes = styled.View`
  box-sizing: border-box;
  display: inline-block;
  width: 400px;
`;

export const Button = styled.TouchableOpacity`
  border-radius: 7px;
  background-color: #001f3f;
  padding: 5px 7px;
  font-size: 20px;
  letter-spacing: 0.6px;
  margin: 0 5px;
`;
