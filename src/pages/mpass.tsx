import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { User } from "@/types";
import { login } from "@/store/user";

const user1: User = {
  idnp: "1234567891234",
  name: "Daniela",
  surname: "Vornic",
  region: 1,
  birthdate: "2004-01-23",
  email: "daniela.vornic@gmail.com",
};

const MPass = () => {
  const dispatch = useDispatch();
  const { push } = useRouter();
  const [img, setImg] = useState("/images/mpass-screen.png");

  const handleClick = () => {
    if (img === "/images/mpass-screen-filled.png") {
      dispatch(login(user1));
      push("/");
    } else {
      setImg("/images/mpass-screen-filled.png");
    }
  };

  return (
    <>
      <Head>
        <title>MPass - Autentificare</title>
        <link rel="icon" href="/images/mpass.png" />
      </Head>
      <div onClick={handleClick}>
        <img src={img} alt="MPass" width="100%" />
      </div>
    </>
  );
};

export default MPass;
