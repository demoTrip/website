import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import "./CollapsePanel.less";

export default function CollapsePanel(props: any) {
  const {
    prefixCls = "CollapsePanel",
    children,
    collapse = false,
    bodyStyle = {},
  } = props;

  const collapsePanel: any = useRef(null);
  const [collapseOriginalHeight, setCollapseOriginalHeight] = useState(0);

  useEffect(() => {
    const targetHeight = collapse ? 0 : collapsePanel.current.scrollHeight;
    if (targetHeight !== collapseOriginalHeight) {
      setCollapseOriginalHeight(targetHeight);
    }
  }, [collapse]);

  useEffect(() => {
    startAnimation(collapseOriginalHeight);
  }, [collapseOriginalHeight]);

  const startAnimation = (scrollHeight: number) => {
    $(collapsePanel.current).animate(
      {
        height: scrollHeight,
      },
      500
    );
  };

  const bodyClass = classNames({
    [`${prefixCls}-body`]: true,
  });

  const body = (
    <div className={bodyClass} style={bodyStyle} ref={collapsePanel}>
      {children}
    </div>
  );
  return <div>{body}</div>;
}
