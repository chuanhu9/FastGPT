import React, { useCallback } from 'react';
import { Flex } from '@chakra-ui/react';
import type { ResLogin } from '@/global/support/api/userRes.d';
import { useRouter } from 'next/router';
import { serviceSideProps } from '@/web/common/i18n/utils';
import { clearToken } from '@/web/support/user/auth';
import { useMount } from 'ahooks';
import { getWebReqUrl } from '@fastgpt/web/common/system/utils';
import { LoginContainer } from '@/pageComponents/login';

const Login = ({ ChineseRedirectUrl }: { ChineseRedirectUrl: string }) => {
  const router = useRouter();
  const { lastRoute = '' } = router.query as { lastRoute: string };

  const loginSuccess = useCallback(
    (res: ResLogin) => {
      const decodeLastRoute = decodeURIComponent(lastRoute);

      const navigateTo =
        decodeLastRoute && !decodeLastRoute.includes('/login') && decodeLastRoute.startsWith('/')
          ? lastRoute
          : '/dashboard/apps';

      router.push(navigateTo);
    },
    [lastRoute, router]
  );

  useMount(() => {
    clearToken();
    router.prefetch('/dashboard/apps');
  });

  return (
    <Flex
      alignItems={'center'}
      justifyContent={'center'}
      bg={`url(${getWebReqUrl('/icon/login-bg.svg')}) no-repeat`}
      backgroundSize={'cover'}
      userSelect={'none'}
      h={'100%'}
    >
      <Flex
        flexDirection={'column'}
        w={['100%', '556px']}
        h={['100%', '677px']}
        bg={'white'}
        px={['5vw', '88px']}
        py={['5vh', '64px']}
        borderRadius={[0, '16px']}
        boxShadow={[
          '',
          '0px 32px 64px -12px rgba(19, 51, 107, 0.20), 0px 0px 1px 0px rgba(19, 51, 107, 0.20)'
        ]}
      >
        <LoginContainer
          onSuccess={loginSuccess}
          chineseRedirectUrl={ChineseRedirectUrl}
          languageSelectorPosition="absolute-top-right"
        />
      </Flex>
    </Flex>
  );
};

export async function getServerSideProps(context: any) {
  return {
    props: {
      ChineseRedirectUrl: process.env.CHINESE_IP_REDIRECT_URL ?? '',
      ...(await serviceSideProps(context, ['app', 'user', 'login']))
    }
  };
}

export default Login;
