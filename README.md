# LeoFi: Decentralized Asset Management Protocol

LeoFi is a cutting-edge decentralized asset management protocol designed to revolutionize the way users interact with and manage their digital assets. By combining advanced blockchain technology with user-friendly interfaces, LeoFi offers a comprehensive solution for both novice and experienced users in the decentralized finance (DeFi) space.

## 🌟 Key Features

- **Decentralized Asset Management**: Securely manage your digital assets without intermediaries.
- **AI-Powered Chat Assistant**: Get real-time support and insights through our intelligent chat interface.
- **Interactive Dashboard**: Visualize and control your portfolio with our intuitive web application.
- **Off-Chain Services**: Enhance performance and user experience with our dedicated off-chain solution.

## 🏗️ Repository Structure

Our project is organized into three main components:

1. **Main (Bot)**: The core of our AI-powered chat assistant.
   - Repository: `main`
   - Features: Natural language processing, asset management commands, real-time market data integration.

2. **Web Application**: Our user dashboard for portfolio management and visualization.
   - Repository: `leofi-profile`
   - Features: Portfolio overview, transaction history, performance analytics, user settings.

3. **Off-Chain Services**: Supporting infrastructure for enhanced performance and features.
   - Repository: `emc-service`
   - Features: Data caching, complex computations, third-party integrations.

## 🚀 Getting Started

To get started with LeoFi, please refer to the individual README files in each repository for specific setup instructions:

- [Chat Assistant Setup](./main/README.md)
- [Web Application Setup](./leofi-profile/README.md)
- [Off-Chain Services Setup](./emc-service/README.md)

## 🔧 Running the Sector

To run the LeoFi sector, which includes all components of the system, follow these steps:

1. **Clone the Repositories**

   \`\`\`bash
   git clone https://github.com/leofi/main.git
   git clone https://github.com/leofi/leofi-profile.git
   git clone https://github.com/leofi/emc-service.git
   \`\`\`

2. **Set Up Environment Variables**

   Create a `.env` file in each project directory and add the necessary environment variables. Refer to the `.env.example` files in each repository for the required variables.

3. **Install Dependencies**

   Navigate to each project directory and install the dependencies:

   \`\`\`bash
   cd main && npm install
   cd ../leofi-profile && npm install
   cd ../emc-service && npm install
   \`\`\`

4. **Start the Services**

   Open three terminal windows, one for each service:

   - For the main bot:
     \`\`\`bash
     cd main && npm run start
     \`\`\`

   - For the web application:
     \`\`\`bash
     cd leofi-profile && npm run dev
     \`\`\`

   - For the off-chain service:
     \`\`\`bash
     cd emc-service && npm run start
     \`\`\`

5. **Access the Applications**

   - The chat bot will be available at `http://localhost:3000`
   - The web dashboard will be accessible at `http://localhost:3001`
   - The off-chain service API will be running at `http://localhost:4000`

6. **Run Tests (Optional)**

   To ensure everything is working correctly, you can run the test suites for each project:

   \`\`\`bash
   cd main && npm test
   cd ../leofi-profile && npm test
   cd ../emc-service && npm test
   \`\`\`

Please note that you may need to have certain dependencies installed on your system, such as Node.js (v14 or later) and npm. For detailed requirements and troubleshooting, refer to the individual README files in each repository.


## 📚 Documentation

For comprehensive documentation on how to use LeoFi, please visit our [official documentation](https://docs.leofi.io).

## 🤝 Contributing

We welcome contributions from the community! If you'd like to contribute, please check out our [Contribution Guidelines](CONTRIBUTING.md).

## 📄 License

LeoFi is released under the [MIT License](LICENSE).

## 📞 Support

If you encounter any issues or have questions, please reach out to our support team at support@leofi.io or use the chat assistant in our application.

---

LeoFi - Empowering Your Financial Future with Decentralized Asset Management

