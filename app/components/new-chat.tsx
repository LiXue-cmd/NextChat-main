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
        model={props.mask.name}
      />
      <div className={clsx(styles["mask-name"], "one-line")}>
        {props.mask.name}
      </div>
    </div>
  );
}

const useMaskGroup = () => {
  const [groups, setGroups] = useState<Mask[]>([]);
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
        
        // 关键修改：确认data.data是否为数组
        if (data.code === 200 && Array.isArray(data.rows)) {
          setGroups(data.rows);
        } else {
          throw new Error(data.msg || 'Invalid API response format');
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

  return { groups, loading, error };
};

export function NewChat() {
  const chatStore = useChatStore();
  const maskStore = useMaskStore();

  const masks = maskStore.getAll();
  const { groups, loading, error } = useMaskGroup();
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

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
        <p>Error: {error}</p>
      </div>
    );
  }

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




      <div className={styles["masks"]} ref={maskRef}>
        {Array.isArray(groups) ? (
          groups.map((mask, index) => (
            <div key={index} className={styles["mask-row"]} style={{border:'1px solid red'}}>
            <MaskItem
              key={index}
              mask={mask}
              onClick={() => startChat(mask)}
            />
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            无法获取模型列表
          </div>
        )}
      </div>
    </div>
  );
}