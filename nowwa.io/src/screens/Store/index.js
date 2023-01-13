import React, { useState, useEffect } from "react";
import cn from "classnames";
import styles from "./Store.module.sass";
import { Range, getTrackBackground } from "react-range";
import Icon from "../../components/Icon";
import Card from "../../components/Card";
import Dropdown from "../../components/Dropdown";
import { ApplicationModal, attributes } from '../../constants'
import { useGalleryModalToggle, useModalOpen } from '../../hooks/store'
import GalleryCard from "../../components/GalleryCard";
import useNFTMoralis from '../../hooks/useNFTMoralis';
import Modal from "../../components/Modal";

const Store = () => {

  const [ showFilter, setShowFilter ] = useState(false)
  const [ searchAttr, setSearchAttr ] = useState([])
  const [ nftDetail, setNftDetail ] = useState({})
  const [ showCount, setShowCount ] = useState(20)
  const [ searchTokenId, setSearchTokenId ] = useState('')

  // const openModal = useModalOpen( ApplicationModal.GALLERY )
  // const toggleModal = useGalleryModalToggle()
  const [openModal, setOpenModal] = useState(false);
  const toggleModal = (value) => {
    setOpenModal(value);
  }
  const { myNFTData } = useNFTMoralis()
  const detectScroll = () => {
      if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight * 90 / 100)) {
          setShowCount(prev => prev + 20)
      }
  }

  useEffect(() => {
      window.addEventListener('scroll', detectScroll)

      return (() => window.removeEventListener('scroll', detectScroll))
  }, [])

  const onClickImage = (item) => {
      setNftDetail(item)

      toggleModal(true)
      console.log('over here')
  }

  const handleClearFilter = () => {
      setSearchAttr([])
      setSearchTokenId('')
  }

  return (
    <div className={cn("section-pt80", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.row}>
          <div className={styles.wrapper}>
            <div className={styles.list}>
              {myNFTData.length > 0 && myNFTData.map((x, index) => (
                <Card 
                  className={styles.card} 
                  item={x} 
                  key={index} 
                  open={ () => onClickImage(x) }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Modal
        visible={openModal}
        onClose={() => toggleModal(false) }
      >
        <GalleryCard nftDetail={nftDetail} />
      </Modal>
    </div>
  );
};

export default Store;
