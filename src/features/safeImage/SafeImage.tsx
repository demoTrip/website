import {useState, CSSProperties} from 'react';

/**
 * 图片加载失败就显示默认图片
 * 使用hook方式
 * @param {*} src  图片路径
 * @param {*} style  图片样式
 * @param {*} defaultImg  默认显示的图片路径
 */
const SafeImage = (props: {src: string, defaultImg: string, className: string, style?: CSSProperties}) => {
  const { src, defaultImg, style, className } = props;

    const [imgSrc, handleImageErrored] = useState<string>(src);

    return (
        <img style={style}
            className={className}
            src={imgSrc}
            onError={() => handleImageErrored(defaultImg)}
        />
    );
}
export default SafeImage;