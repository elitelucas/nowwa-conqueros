import React, { useState, useEffect } from "react";
import cn from "classnames";
import styles from "./Search01.module.sass";
import Icon from "../../components/Icon";
import Card from "../../components/Card";
import GalleryItem from "../../components/GalleryItem";
import { attributes } from '../../constants'
import GalleryCard from "../../components/GalleryCard";
import useNFTMoralis from '../../hooks/useNFTMoralis';
import Attribute from "./Attribute";
import Modal from "../../components/Modal";

const Gallery = () => {

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
  const { allNFTData } = useNFTMoralis()

  const getFilteredData = (data) => {

    return data.filter((item) => {
        const metadata = JSON.parse(item.metadata)

        if( searchTokenId !== '' && Number(item.token_id) !== Number(searchTokenId) )
            return false

        for( let i = 0; i < searchAttr.length; i++ ) {
            if (!metadata)
                continue

            const temp = searchAttr[i]
            const index = metadata.attributes.findIndex((attr) => attr.trait_type === temp.trait_type && attr.value === temp.value)

            if( index === -1 )  return false
        }

        return true
    })
  }
  const dataArray = getFilteredData(allNFTData).slice(0, showCount)

  const toggleAttr = ( name, attr ) => {
      console.log(name)
      console.log(attr)

      const newSearchAttr = [ ...searchAttr ]

      const index = newSearchAttr.findIndex( (item) => item.trait_type === name && item.value === attr )

      if( index === -1 )
          newSearchAttr.push({ trait_type: name, value: attr })
      else
          newSearchAttr.splice( index, 1 )

      setSearchAttr(newSearchAttr)
  }

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
          <div className={styles.filters}>
            <div className={styles.range}>
              <div
                className={styles.search}
              >
                <input
                  className={styles.input}
                  type="text"
                  name="search"
                  placeholder="Token ID..."
                  required
                  value={ searchTokenId } 
                  onChange={ (ev) => setSearchTokenId( ev.target.value ) }
                />
                <button className={styles.result}>
                  <Icon name="search" size="16" />
                </button>
              </div>
            </div>
            <div className={styles.group}>
            { Object.keys(attributes).map( (item, index) => (
                <div key={ `attributes_${index}` }>
                    <Attribute name={ item } searchAttr={ searchAttr } toggleAttr={ toggleAttr } />
                </div>
            )) }
            </div>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.list}>
              {dataArray.map((x, index) => (
                <GalleryItem 
                  className={styles.card} 
                  item={x} 
                  key={index} 
                  open={ () => onClickImage(x) }
                />
              ))}
              { allNFTData.length > 0 && !dataArray.length ? (
                <div className={styles.nothing}>
                    <div className={cn('h4')}>No search result found.</div>
                    {/* <button className={cn("button-stroke",styles.button)} onClick={handleClearFilter}>Clear Filters</button> */}
                </div>
              ) : null }
            </div>
            {/* <div className={styles.btns}>
              <button className={cn("button-stroke", styles.button)}>
                <span>Load more</span>
              </button>
            </div> */}
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

export default Gallery;
