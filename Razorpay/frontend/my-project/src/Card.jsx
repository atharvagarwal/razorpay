import { Image,VStack,Text,Button } from "@chakra-ui/react";
import React from "react"

const Card = ({amount,img,checkoutHandler}) => {
  return (
    <VStack>
        <Image src={img} boxSize={"64"} objectFit="cover"></Image>
        <Text>{amount}</Text>
        <Button onClick={()=>checkoutHandler(amount)}>Buy Now</Button>
    </VStack>
  )
}

export default Card