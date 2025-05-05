import { useEffect, useRef, useState } from "react";
import { Path, SlotID } from "../constant";
import { IconButton } from "./button";
import { EmojiAvatar } from "./emoji";
import styles from "./new-chat.module.scss";

import LeftIcon from "../icons/left.svg";
import LightningIcon from "../icons/lightning.svg";
import EyeIcon from "../icons/eye.svg";

import { useLocation, useNavigate } from "react-router-dom";
import { Mask, useMaskStore } from "../store/mask";
import Locale from "../locales";
import { useAppConfig, useChatStore } from "../store";
import { MaskAvatar } from "./mask";
import { useCommand } from "../command";
import { showConfirm } from "./ui-lib";
import { BUILTIN_MASK_STORE } from "../masks";
import clsx from "clsx";
import Cookies from 'js-cookie';

function MaskItem(props: { mask: Mask; onClick?: () => void }) {
  return (
    <div className={styles["mask"]} onClick={props.onClick}>
      <MaskAvatar
        avatar={props.mask.avatar}
        model={props.mask.modelConfig.model}
      />
      <div className={clsx(styles["mask-name"], "one-line")}>
        {props.mask.applicationName}
      </div>
    </div>
  );
}

const useMaskGroup = () => {
  const [groups, setGroups] = useState<Mask[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(
          'http://140.143.208.64:8080/system/model/list',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': Cookies.get('token') || '',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.code === 200) {
          setGroups(data.rows);
        } else {
          throw new Error(data.msg || 'Failed to fetch mask groups');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();

    // 添加窗口大小变化监听
    const handleResize = () => {
      // 如果需要在窗口大小变化时重新获取数据，可以取消下面的注释
      // fetchGroups();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
console.log('groups',groups)
  return { groups, loading, error };
};
// const useMaskGroup = async () => {
  //   const [groups, setGroups] = useState<Mask[][]>([]);

  // useEffect(() => {
  //   const computeGroup = () => {
  //     const appBody = document.getElementById(SlotID.AppBody);
  //     if (!appBody || masks.length === 0) return;

  //     const rect = appBody.getBoundingClientRect();
  //     const maxWidth = rect.width;
  //     const maxHeight = rect.height * 0.6;
  //     const maskItemWidth = 120;
  //     const maskItemHeight = 50;

  //     const randomMask = () => masks[Math.floor(Math.random() * masks.length)];
  //     let maskIndex = 0;
  //     const nextMask = () => masks[maskIndex++ % masks.length];

  //     const rows = Math.ceil(maxHeight / maskItemHeight);
  //     const cols = Math.ceil(maxWidth / maskItemWidth);

  //     const newGroups = new Array(rows)
  //       .fill(0)
  //       .map((_, _i) =>
  //         new Array(cols)
  //           .fill(0)
  //           .map((_, j) => (j < 1 || j > cols - 2 ? randomMask() : nextMask())),
  //       );

  //     setGroups(newGroups);
  //   };

  //   computeGroup();

  //   window.addEventListener("resize", computeGroup);
  //   return () => window.removeEventListener("resize", computeGroup);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

//   const [groups, setGroups] = useState<Mask[][]>([])
//   try {
//     // 查询应用
//     const res = await fetch('http://140.143.208.64:8080//system/modelApplication/list', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': Cookies.get('token')
//       },
//       // body:{}
//       // body: JSON.stringify({ username, password, rememberMe }),
//     });
//     // query:"{\"amis_id\":\"amis_yQp2WQ\",\"amis_tag\":\"local_knowledge\"}"
//     // redirect:"/index"
//     // token
//     // res.setHeader('Set-Cookie', `token=${token}; Path=/; Max-Age=3600*24*7`);
//     const data = await res.json();
//     console.log('data',data)
//     if (data.code == 200) {
//       // groups = data.rows
//       setGroups(data.rows)
//     } else {
//       setError('用户名或密码错误');
//     }
//   } catch (error) {
//     setError('登录失败，请稍后重试');
//   }
//   return groups;
// }

export function NewChat() {
  const chatStore = useChatStore();
  const maskStore = useMaskStore();

  const masks = maskStore.getAll();
  const groups = useMaskGroup(masks);
  console.log('groups',groups)
  const navigate = useNavigate();
  const config = useAppConfig();

  const maskRef = useRef<HTMLDivElement>(null);

  const { state } = useLocation();

  const startChat = (mask?: Mask) => {
    setTimeout(() => {
      chatStore.newSession(mask);
      navigate(Path.Chat);
    }, 10);
  };

  useCommand({
    mask: (id) => {
      try {
        const mask = maskStore.get(id) ?? BUILTIN_MASK_STORE.get(id);
        startChat(mask ?? undefined);
      } catch {
        console.error("[New Chat] failed to create chat from mask id=", id);
      }
    },
  });

  useEffect(() => {
    if (maskRef.current) {
      maskRef.current.scrollLeft =
        (maskRef.current.scrollWidth - maskRef.current.clientWidth) / 2;
    }
  }, [groups]);

  return (
    <div className={styles["new-chat"]}>
      <div className={styles["mask-header"]}>
        <IconButton
          icon={<LeftIcon />}
          text={Locale.NewChat.Return}
          onClick={() => navigate(Path.Home)}
        ></IconButton>
        {!state?.fromHome && (
          <IconButton
            text={Locale.NewChat.NotShow}
            onClick={async () => {
              if (await showConfirm(Locale.NewChat.ConfirmNoShow)) {
                startChat();
                config.update(
                  (config) => (config.dontShowMaskSplashScreen = true),
                );
              }
            }}
          ></IconButton>
        )}
      </div>
      <div className={styles["mask-cards"]}>
        <div className={styles["mask-card"]}>
          <EmojiAvatar avatar="1f606" size={24} />
        </div>
        <div className={styles["mask-card"]}>
          <EmojiAvatar avatar="1f916" size={24} />
        </div>
        <div className={styles["mask-card"]}>
          <EmojiAvatar avatar="1f479" size={24} />
        </div>
      </div>

      <div className={styles["title"]}>{Locale.NewChat.Title}</div>
      <div className={styles["sub-title"]}>{Locale.NewChat.SubTitle}</div>

      <div className={styles["actions"]}>
        <IconButton
          text={Locale.NewChat.More}
          onClick={() => navigate(Path.Masks)}
          icon={<EyeIcon />}
          bordered
          shadow
        />

        <IconButton
          text={Locale.NewChat.Skip}
          onClick={() => startChat()}
          icon={<LightningIcon />}
          type="primary"
          shadow
          className={styles["skip"]}
        />
      </div>

      {/* <div className={styles["masks"]} ref={maskRef}>
        {groups.map((masks, i) => (
          <div key={i} className={styles["mask-row"]} style={{border:'1px solid red'}}>
            {masks.map((mask, index) => (
              <MaskItem
                key={index}
                mask={mask}
                onClick={() => startChat(mask)}
              />
            ))}
          </div>
        ))}
      </div>   */}

    </div>
  );
}
