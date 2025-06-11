# Books-Store

Books-Store is a platform where users can buy, sell, rent and lend books, and can read books online. Built on MERN stack, it features simple UI design with all the necessary features of an e-commerce app.

Live Link: https://books-epo1.onrender.com

## ✨ Features

*   **Payment Gateway**: Features razorpay secured payment gateway for book payments.
*   **Gmail notifications**: Allows users to turn on and off gmail notifications via OAuth playground and nodemailer transporter.
*   **Cart**: Maintains separate carts for users to manage their favourite books.
*   **Multi-langugae support**: Features multi-language integration using i18n.
*   **Interactive UI**: Features interactive UI design using Tailwind CSS, supporting different size devices.
*   **User Profiles**: Profiles of user showing past purchases and personal info.

## 🛠️ Tech Stack

*   **Framework**: [React.js](https://react.dev/) 
*   **Language**: [JavaScript](https://devdocs.io/javascript/), [Node.js](https://nodejs.org/en)
*   **Server**: [Express.js](https://expressjs.com/)
*   **Database**: [MongoDB](https://www.mongodb.com/)
*   **Styling**: [Tailwind](https://tailwindcss.com/)
*   **Form Handling**: [React Hook Form](https://react-hook-form.com/)
*   **Email Service**: [Nodemailer](https://nodemailer.com/) (for notifications)
*   **State Management**: React Context API

## 📂 Project Structure

The project follows a standard Next.js structure with some key directories:

```
dakshh0827-blogs/
├── frontend/                      # Frontend logic
|   ├── public/                    # Static files and data
|   ├── src/                       # Frontend source directory
|   |   ├── assets/                # Static file
|   |   ├── components/            # Reusable components of react
|   |   ├── constants/             # Constant components
|   |   ├── lib/                   # Configuration and utility files
|   |   ├── pages/                 # Pages of the site
|   |   ├── store/                 # API call logic stores
├── backend/                       # Backend logic
|   ├── src/                       # Backend source directory
|   |   ├── controllers/           # APIs 
|   |   ├── lib/                   # Configuration files
|   |   ├── middlewares/           # Middlewares for verification 
|   |   ├── models/                # Database models(MongoDB Atlas)
|   |   ├── routes/                # Routes definition 


```

## 🚀 Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

*   Node.js (v18.x or later recommended)
*   npm or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/dakshh0827/Books-store.git
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Then, fill in the required values in your `.env` file. You will need to add/update the following variables:

    ```env
      MONGODB_URI = ""

      PORT = 5001
      
      JWT_KEY = ""
      
      
      CLOUDINARY_CLOUD_NAME = ""
      CLOUDINARY_API_KEY = ""
      CLOUDINARY_API_SECRET = ""
      
      NODE_ENV = "development"
    ```

4.  **Run the development server in backend:**
    ```bash
    cd backend
    npm run dev
    # or
    yarn dev
    ```
5.  **Run the development server in frontend:**
    ```bash
    cd frontend
    npm run dev
    # or
    yarn dev
    ```
    Open [http://localhost:5001](http://localhost:5001) with your browser to see the result.





*Thankyou*
