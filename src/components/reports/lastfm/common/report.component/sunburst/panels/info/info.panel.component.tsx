import { Text, Box, Container } from "@chakra-ui/react";
import useColour from "@src/hooks/ui/colour.hook";

export const testIDs = {
  SunBurstInfoPanelMessage: "SunBurstInfoPanelMessage",
};

export interface SunBurstInfoPanelProps {
  breakPoints: Array<number>;
  message: string;
}

export default function SunBurstInfoPanel({
  breakPoints,
  message,
}: SunBurstInfoPanelProps) {
  const { componentColour } = useColour();

  return (
    <Box
      mt={1}
      mb={1}
      borderWidth={2}
      borderColor={componentColour.border}
      bg={componentColour.background}
      color={componentColour.foreground}
      w={breakPoints}
    >
      <Container p={1} textAlign={"center"}>
        <Text fontSize={"xs"} data-testid={testIDs.SunBurstInfoPanelMessage}>
          {message}
        </Text>
      </Container>
    </Box>
  );
}
