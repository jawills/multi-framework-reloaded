import { appConfig } from "@/config/app";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Home</h1>
        <p className="text-lg text-gray-600 mb-8">
          Welcome to {appConfig.name}
        </p>
        <p className="text-lg text-gray-600 mb-8">
          {appConfig.description}
        </p>
      </div>
    </div>
  );
}
