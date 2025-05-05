import { Analytics } from "@vercel/analytics/react";
import { Home } from "./components/home";
import { getServerSideConfig } from "./config/server";
import { TestButton } from '@/components/TestButton';

const serverConfig = getServerSideConfig();

export default async function App() {
  return (
    <>
    <TestButton />
      <Home />
      {serverConfig?.isVercel && (
        <>
          <Analytics />
        </>
      )}
    </>
  );
}
