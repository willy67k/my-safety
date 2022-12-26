import axios from "axios";
import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import DragStatusEnum from "../enum/dragStatus";
import Api from "../resource/api";
import { setStatus, setTargetItem } from "../store/slice/dragSlice";

function useDrag(props) {
  const { safety, setSafety } = props;

  const dispatch = useDispatch();
  const dragStatus = useSelector((state) => state.drag.status);
  const dragCardId = useSelector((state) => state.drag.cardId);
  const dragItemId = useSelector((state) => state.drag.itemId);

  const originIndex = useRef(0);
  const currentIndex = useRef(0);
  const prevY = useRef(0);
  const nextY = useRef(0);
  const group = useRef(null);
  const itemRefs = useRef(null);
  const braekpoints = useRef([]);

  const startDrag = useCallback(() => {
    group.current = document.querySelector(`#group-${dragCardId}`);
    if (!group.current) return;
    itemRefs.current = [...group.current.children].slice(1, -1);
    originIndex.current = itemRefs.current.findIndex((el) => el.id === `item-${dragItemId}`);
    currentIndex.current = itemRefs.current.findIndex((el) => el.id === `item-${dragItemId}`);
    braekpoints.current = itemRefs.current.map((el) => el.getBoundingClientRect().top);
    prevY.current = braekpoints.current[currentIndex.current - 1];
    nextY.current = braekpoints.current[currentIndex.current + 1];
  }, [dragCardId, dragItemId]);

  const itemDragging = useCallback(
    (e) => {
      if (e.target.closest("[data-target=form-item]")?.id.includes("add")) return;
      if (dragStatus !== DragStatusEnum.dragging) return;

      const item = document.querySelector(`#item-${dragItemId}`);

      if (e.clientY > nextY.current) {
        currentIndex.current += 1;
        const offset = currentIndex.current - originIndex.current;
        item.style.transform = `translateY(${offset * 46}px)`;

        if (offset > 0) {
          itemRefs.current[currentIndex.current].style.transform = "translateY(-46px)";
        } else {
          itemRefs.current[currentIndex.current - 1].style.transform = null;
        }
      }

      if (e.clientY < prevY.current) {
        currentIndex.current -= 1;
        const offset = currentIndex.current - originIndex.current;
        item.style.transform = `translateY(${offset * 46}px)`;

        if (offset >= 0) {
          itemRefs.current[currentIndex.current + 1].style.transform = null;
        } else {
          itemRefs.current[currentIndex.current].style.transform = "translateY(46px)";
        }
      }

      prevY.current = braekpoints.current[currentIndex.current - 1] + 46;
      nextY.current = braekpoints.current[currentIndex.current + 1];
    },
    [dragStatus, dragItemId]
  );

  const releaseDrag = useCallback(async () => {
    dispatch(setTargetItem({ id_group: null, id: null }));
    if (dragStatus === DragStatusEnum.normal) return;
    dispatch(setStatus(DragStatusEnum.normal));

    if (originIndex.current === currentIndex.current) return;

    const items = safety.find((el) => el.id === dragCardId).items.slice();
    const out = items.splice(originIndex.current, 1)[0];
    items.splice(currentIndex.current, 0, out);

    const orders = items.map((el, i) => {
      return { id: el.id, order: i };
    });

    const CCtoken = axios.CancelToken.source();
    try {
      const { data } = await Api.setItemOrder(dragCardId, orders, CCtoken);
      setSafety((prev) => {
        let newState = [...prev];
        const index = newState.findIndex((el) => el.id === dragCardId);
        newState[index].items = data;
        return newState;
      });
    } catch (err) {
      console.log(err);
    } finally {
      itemRefs.current.forEach((el) => {
        el.style.transform = null;
      });
    }
    return;
  }, [dispatch, dragStatus, dragCardId, safety, setSafety]);

  return { startDrag, itemDragging, releaseDrag };
}

export default useDrag;
