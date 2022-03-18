import React from 'react'
import PropTypes from 'prop-types'

const Rating = ({ value, text, color }) => {
    // spread operator just spreads empty Array of 5 elements into a new array. 
    // When you do so, you get [undefined,...,undefined] array. That is why "_" variable is used. 
    // You can name it as you want because it is not used anyway. 
    // And I heard somewhere that it is some kind of convention to name unused local variable as '_'

    //eg when value = 2.5
    //1st loop value = 2.5 >= i(0)+1        get 1 star <i> icon
    //2nd loop value = 2.5 >= i(1)+1        get 1 more star <i> icon
    //3rd loop value = 2.5 >= i(2)+0.5      get 0.5 more half star <i> icon
    //4th loop value = 2.5 < i(3)           no more icon
    //5th loop value = 2.5 < i(4)           no more icon
    const ratingStar = [...Array(5)].map((_, i) => {
        const className = value >= i + 1
            ? 'fas fa-star'                     //full star
            : value >= i + 0.5
                ? 'fas fa-star-half-alt'        //half star
                : 'far fa-star'                 //empty star
        return <i key={i} style={{ color: color }} className={className} />
    })
    return (
        <div className='rating'>
            <span>
                {ratingStar}
            </span>

            {/* if text has value, show text, elst show ""
            can be written as {text && text} */}
            <span> {text ? text : ''}</span>
        </div>
    )
}

Rating.defaultProps = {
    color: '#f8e825',
    value: 0
}

Rating.propTypes = {
    value: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    color: PropTypes.string
}

export default Rating