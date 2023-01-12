import { useState, useEffect } from "react"
import { colors } from "../../constants"
import styles from './Gallery.module.sass';
import cn from 'classnames';

export default function GalleryCard ({ isOpen, onClose, nftDetail }) {
    const metadata = nftDetail.metadata ? JSON.parse( nftDetail.metadata ) : { attributes: [] }
    const [backgroundColor, setBack] = useState(colors['Default']);

    const getBackgroundColor = (metadata) => {
        if (!metadata.attributes.length)
        return colors['Default']

        metadata?.attributes.map((item) => {
            let color;
            if (item.trait_type == "Background") {
                if (colors[item.value]) {
                    color = colors[item.value]
                } else {
                    color = colors['Default']
                }

                // console.log("metadata", color)
                // if (document.getElementsByClassName('ReactModal__Content')[0]) {
                //     console.log('I am ready')
                //     document.getElementsByClassName('ReactModal__Content')[0].style.background = color;
                // }
                // for (let element of document.getElementsByClassName('ReactModal__Content')) {
                //     console.log(element)
                //     element.style.background = color;
                // }

                setBack(color)
                return;
            }
        })
    }

    useEffect(() => {
        getBackgroundColor(metadata);
    }, [metadata])

    return (
        <div className={styles.gallery} style={{ background: backgroundColor }}>
            <div className={styles.viewer}>
                <img src={`https://ipfs.io/ipfs/QmXmuSenZRnofhGMz2NyT3Yc4Zrty1TypuiBKDcaBsNw9V/${ Number(nftDetail.token_id) + 1 }.gif`} alt='pic' />
            </div>

            <div className={styles.detail}>
                <div className={styles.inner}>
                    <div className={styles.title}>
                        <div className={styles.no}>
                            <div className={styles.number}>#</div>
                            <div>
                                <div className={styles.name}>NOWNFT</div> 
                                <div className={styles.token}>{ nftDetail.token_id }</div>
                            </div>
                        </div>
                        <a 
                            target={'_blank'}
                            href={`https://testnets.opensea.io/assets/goerli/0xe74da0a4e7c5fc09fa793498cce70e598d8432b2/${ nftDetail.token_id }`}>
                            <img alt="pic" src="/images/opensea.svg" style={{ width: 48, height: 48 }}/>
                        </a>
                    </div>

                    <div className={styles.props}>
                        { (metadata?.attributes).map((item, index) => (
                            <div className={styles.item} key={`attr_${index}`}>
                                <div className={styles.subtitle}>{ item.trait_type }</div>
                                <div className={styles.text}> { item.value } </div>
                            </div>
                        )) }
                    </div>
                </div>
            </div>
        </div>
    )
}