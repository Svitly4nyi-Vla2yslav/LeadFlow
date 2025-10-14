import React from 'react';



export type WorkItemData = {
  id: string;
  folder: string;
  image_name: string;
  title: string;
  description: string;
  preview_url: string | null;
};



const Photo: React.FC = () => {

  return (
    <>
      <h1>Welcome to Our Photography Page</h1>
    </>
  );
};

export default Photo;
