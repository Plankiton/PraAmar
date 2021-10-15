import React, {useState} from 'react';
import {toId} from '../util.js';
import Meal from './Meal.js';
import Charging from './Charging.js';

export default function MealList({cats, meals, selected, onCatScrollEnd, onSetCats}) {
  const [lock, setLock] = useState(false);

  return (<div className="MealList">
    {cats&&cats.map((cat,c) => {
      var origin = cat
      if ((typeof cat) == "function")
        cat = cat(c);
      else if ((typeof cat) == "string")
        cat = {id: cat, label: cat, color: "#00000000"};
      if (cat.sel && selected && cat.id !== selected.id)
        cat.color = cat.sel;

      cat = {...origin, ...cat}

      return (<div className="CatHome" key={cat.id+(Date.now())/1000+Math.random()}>
        <div className="PaddingTop" id={cat.id}>
        </div>
        <h1 className="CategoryTitle">
          <span style={{backgroundColor: cat.color}}>
            <a href={`#${cat.id}`} style={{color: cat.text}}>{cat.label}</a>
          </span>
        </h1>
        <div className="Category"
          onLoad={(e) => {
            e.preventDefault();
          }}
          onScroll={async (e) => {
            e.preventDefault();
            if (e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight-20 && !lock) {
              console.log("Scroll ENDDD");
              cat.page += 1;
              cats[cat.index] = cat
              onSetCats(cat, cats);
              setLock(!lock);
              await onCatScrollEnd(cat)
              setLock(!lock);
            }
          }}
          >
          <div className="Meals">{meals&&meals[c]&&meals[c].map((meal, pos) => {
            if (meals[c].length < cat.meal_count && meals[c][meals[c].length-1].charging === undefined) {
              meals[c].push({charging: true});
            } else {
              if (meals[c][meals[c].length-1].charging !== undefined) {
                meals[c][meals[c].length-1].charging = false;
              }
            }

            if (meal.charging === false) return null;

            return meal.charging?(<Charging
              key={cat.id+c+((Date.now())/1000)+Math.random()}
            />):(<Meal
              cat={meal.Cat}
              name={meal.Name}
              desc={meal.Desc}
              image={meal.Image}
              fullDesc={meal.FullDesc}
              price={meal.Price}

              id={toId(meal.Name)}
              key={cat.id+meal.Desc+toId(meal.Name)+((Date.now())/1000)+Math.random()}
            />);
          })}</div>
        </div>
      </div>);
    })}
  </div>);
}
