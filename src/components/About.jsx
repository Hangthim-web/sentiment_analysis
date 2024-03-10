import React, { useState } from "react";
import { Link } from "react-router-dom";
// import {handleLogout} from '/Home';
import { useNavigate } from "react-router-dom";

const About = () => {
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getUserToken = () => {
    return localStorage.getItem("access");
  };

  const logout = () => {
    localStorage.removeItem("access");
  };
  const handleLogout = async () => {
    try {
      setIsLoading(true);

      // Assuming you have a function to get the user's token
      const AccessToken = getUserToken(); // You should implement this function

      const response = await fetch("http://127.0.0.1:8000/api/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AccessToken}`, // Include the token in the Authorization header
        },
        // Include any request body if needed
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      logout(); // Clear user-related information from the frontend
      navigate("/login"); // Redirect to the login page or any other desired page
    } catch (error) {
      setError("Logout failed. Please try again.");
      console.error("Error during logout:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="Container mx-auto bg-gray-900 min-h-screen text-white">
      <div className="flex justify-between items-center ">
        <div className="">
          <h1 className="font-bold text-2xl cursor-pointer read-only ml-[80px]">
            HSD
          </h1>
        </div>
        <div>
          <ul className="mr-[80px]">
            <Link
              to="/home"
              className="text-md mr-[22px] hover:underline underline-offset-8 transition ease-in-out delay-100"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-md mr-[22px] hover:underline underline-offset-8 transition ease-in-out delay-100"
            >
              About
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md mt-4 mb-4 hover:bg-red-600 transition ease-in-out delay-50"
            >
              Logout
            </button>
          </ul>
        </div>
      </div>
      <div className=" container mx-auto mt-4">
        <div id="manish_container">
          I am Manish Gopalgee Lorem ipsum dolor sit amet consectetur,
          adipisicing elit. Molestiae consequuntur enim perferendis similique
          recusandae, voluptatem nihil beatae odio dicta unde reprehenderit nisi
          velit neque eveniet fugiat dolorem at consectetur dolores expedita
          dolorum nam, amet officiis quod excepturi! Magnam provident numquam ut
          optio, iusto veniam? Earum aliquam ab iure dicta voluptas.
        </div>
        <div id="jyoti_container">
          I am Jtotindra Karki Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Iste adipisci minus nam nihil reiciendis
          perspiciatis unde cum pariatur vel, quas magnam voluptate nobis odio
          amet incidunt ducimus, necessitatibus sapiente quae saepe explicaboF
          qui accusantium vero? Aliquam quibusdam at repudiandae a placeat
          facere quaerat expedita ad sequi, nemo qui modi sit!
        </div>
        <div id="hangthim_container ">
          I am Hangthim Limbu Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Minus numquam iusto debitis aliquam ipsam alias ipsa
          necessitatibus, est fugit quo quis quas dolor nostrum doloribus quae
          voluptatibus perspiciatis adipisci quam accusantium ut vero id! Optio
          quae quam illo. Ipsam ipsa excepturi voluptatum harum illo eius
          deleniti consequatur hic quos reiciendis.F Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Recusandae libero blanditiis fuga
          cupiditate soluta quisquam dolor maxime, quae debitis ab quo
          consequatur obcaecati totam nobis repellat natus excepturi maiores,
          repudiandae quam. Quibusdam cumque placeat, recusandae animi
          blanditiis ea quia vero adipisci! Laborum eos quibusdam libero
          obcaecati quos, dolor animi doloremque, explicabo laudantium
          architecto quo culpa modi, commodi nesciunt quam provident delectus
          impedit optio qui ea neque et nisi. Illo neque, soluta provident nulla
          harum officia eaque numquam temporibus nesciunt omnis deserunt
          exercitationem possimus tempore eveniet minus atque quas corrupti.
          Facere ea harum nemo beatae consequatur consectetur, nihil
          reprehenderit laboriosam autem possimus quae libero ad eaque molestias
          necessitatibus eius odit quia quod dolore. Accusamus, officiis sequi
          rem eaque ipsam totam possimus amet voluptates, saepe dolorum cum
          consequatur, obcaecati enim eius magnam architecto nobis neque. Beatae
          nulla, iure id debitis illo eaque perspiciatis nihil quas incidunt
          quaerat laudantium et. Repellat itaque fugiat consequatur, asperiores
          tempora minus odio temporibus distinctio dolor saepe. Provident sit
          officia eum id modi consequuntur saepe totam, illum quo quidem iure
          architecto rerum dolores qui nisi, officiis alias libero ratione,
          molestiae eveniet sunt eaque exercitationem maiores nulla. Iure quia
          aliquid repudiandae quaerat ipsum veniam dignissimos, mollitia illum
          saepe quos perferendis, corporis autem recusandae esse neque possimus
          eos doloremque repellendus facere quam quod? Ipsam molestiae,
          excepturi cumque, incidunt blanditiis possimus ea reiciendis dolore
          iure odio ratione praesentium optio officia modi quod a earum pariatur
          enim ducimus iste provident rem voluptatum voluptate. Ducimus,
          obcaecati? Fugit quaerat velit distinctio. Adipisci incidunt,
          repellendus cupiditate, voluptate, eius aperiam tenetur libero placeat
          itaque cumque iusto magnam fugit totam voluptates porro ad harum
          deleniti. Voluptatem nobis laborum ab ex neque odit totam, eum quos,
          commodi fugiat officia. Ullam beatae dignissimos adipisci velit fugiat
          error vel culpa officiis, quia quidem iure necessitatibus deserunt
          quae libero, voluptates quaerat?F
        </div>
      </div>
      {error && <h1>{error}</h1>}
      {loading && <h1>{loading}</h1>}
    </div>
  );
};

export default About;
