import styled from "styled-components";

export const HomeHeaderContainer = styled.div`
  height: 60px;
  background: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  color: #fff;
  padding: 0 30px;
`;

export const ThemeButtonContainer = styled.button`
  margin: 0;
  padding: 0;
  background: ${(props) => props.theme.colors.primary};
  position: absolute;
  left: 50%;
  right: 50%;
  transform: transform(-50%, -50%);
`;
