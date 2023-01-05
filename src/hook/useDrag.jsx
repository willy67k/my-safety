import axios from "axios";
import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import DragStatusEnum from "../enum/dragStatus";
import DragTypeEnum from "../enum/dragType";
import Api from "../resource/api";
import { setStatus, setTargetItem } from "../store/slice/dragSlice";

function useDrag(props) {
  const { safety, setSafety } = props;

  const dispatch = useDispatch();
  const dragStatus = useSelector((state) => state.drag.status);
  const dragType = useSelector((state) => state.drag.type);
  const dragCardId = useSelector((state) => state.drag.cardId);
  const dragItemId = useSelector((state) => state.drag.itemId);

  const originIndex = useRef(0);
  const currentIndex = useRef(0);

  const targetGroup = useRef(null);

  const groupRefs = useRef(null);
  const shadowLayout = useRef(null);
  const oriGroupPos = useRef({ x: 0, y: 0 });
  const allGroupsPos = useRef([]);

  const itemRefs = useRef(null);
  const braekpoints = useRef([]);
  const prevY = useRef(0);
  const nextY = useRef(0);

  const startGroupDrag = useCallback(() => {
    groupRefs.current = [...document.querySelectorAll("[data-target=form-card]")];
    originIndex.current = groupRefs.current.findIndex((el) => el.id === `group-${dragCardId}`);
    currentIndex.current = groupRefs.current.findIndex((el) => el.id === `group-${dragCardId}`);
    oriGroupPos.current = {
      x: targetGroup.current.getBoundingClientRect().x,
      y: targetGroup.current.getBoundingClientRect().y,
    };
    allGroupsPos.current = groupRefs.current.map((el) => {
      return {
        x: el.getBoundingClientRect().x,
        y: el.getBoundingClientRect().y,
      };
    });
    shadowLayout.current = document.createElement("div");
    shadowLayout.current.id = "shadow-layout";

    groupRefs.current.forEach((el, i) => {
      const div = document.createElement("div");
      const { top, left, width, height } = el.getBoundingClientRect();
      div.dataset.shadowIndex = i;
      div.style.cssText = `
        position: fixed;
        width: ${width}px;
        height: ${height}px;
        top: ${top}px;
        left: ${left}px;
        background-color: rgba(0, 128, 0, 0.1);
      `;
      shadowLayout.current.append(div);
    });
    document.body.append(shadowLayout.current);
  }, [dragCardId]);

  const startItemDrag = useCallback(() => {
    itemRefs.current = [...targetGroup.current.children].slice(1, -1);
    originIndex.current = itemRefs.current.findIndex((el) => el.id === `item-${dragItemId}`);
    currentIndex.current = itemRefs.current.findIndex((el) => el.id === `item-${dragItemId}`);
    braekpoints.current = itemRefs.current.map((el) => el.getBoundingClientRect().top);
    prevY.current = braekpoints.current[currentIndex.current - 1];
    nextY.current = braekpoints.current[currentIndex.current + 1];
  }, [dragItemId]);

  const dragStartHandler = useCallback(() => {
    targetGroup.current = document.querySelector(`#group-${dragCardId}`);
    if (!targetGroup.current) return;

    if (dragType === DragTypeEnum.group) startGroupDrag();
    if (dragType === DragTypeEnum.item) startItemDrag();
  }, [dragCardId, dragType, startItemDrag, startGroupDrag]);

  const groupDragging = useCallback((e) => {
    const currentGroup = e.target.closest("[data-shadow-index]");
    if (!currentGroup || targetGroup.current === currentGroup) return;

    currentIndex.current = +currentGroup.dataset.shadowIndex;

    const offset = currentIndex.current - originIndex.current;

    groupRefs.current.forEach((el, i) => {
      if (i !== originIndex.current && offset < 0) {
        if (i >= currentIndex.current && i < originIndex.current) {
          el.style.transform = `translate(${allGroupsPos.current[i + 1].x - allGroupsPos.current[i].x}px, ${
            allGroupsPos.current[i + 1].y - allGroupsPos.current[i].y
          }px)`;
        } else {
          el.style.transform = `translate(0)`;
        }
      }

      if (offset === 0) {
        el.style.transform = `translate(0)`;
      }

      if (i !== originIndex.current && offset > 0) {
        if (i <= currentIndex.current && i > originIndex.current) {
          el.style.transform = `translate(${allGroupsPos.current[i - 1].x - allGroupsPos.current[i].x}px, ${
            allGroupsPos.current[i - 1].y - allGroupsPos.current[i].y
          }px)`;
        } else {
          el.style.transform = `translate(0)`;
        }
      }
    });

    targetGroup.current.style.transform = `translate(${allGroupsPos.current[currentIndex.current].x - oriGroupPos.current.x}px, ${
      allGroupsPos.current[currentIndex.current].y - oriGroupPos.current.y
    }px)`;
  }, []);

  const itemDragging = useCallback(
    (e) => {
      if (e.target.closest("[data-target=form-item]")?.id.includes("add")) return;

      const item = document.querySelector(`#item-${dragItemId}`);

      if (!item) return;

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
    [dragItemId]
  );

  const draggingHandler = useCallback(
    (e) => {
      if (dragStatus !== DragStatusEnum.dragging) return;

      if (dragType === DragTypeEnum.group) groupDragging(e);
      if (dragType === DragTypeEnum.item) itemDragging(e);
    },
    [dragStatus, dragType, groupDragging, itemDragging]
  );

  const endGroupDrag = useCallback(async () => {
    const newSafety = safety.slice();
    const out = newSafety.splice(originIndex.current, 1)[0];
    newSafety.splice(currentIndex.current, 0, out);

    const orders = newSafety.map((el, i) => ({ id: el.id, order: i }));

    const CCtoken = axios.CancelToken.source();
    try {
      const { data } = await Api.setGroupOrder(orders, CCtoken);
      setSafety(data);
    } catch (err) {
      console.log(err);
    } finally {
      groupRefs.current.forEach((el) => {
        el.style.transform = null;
      });
    }
  }, [safety, setSafety]);

  const endItemDrag = useCallback(async () => {
    const items = safety.find((el) => el.id === dragCardId).items.slice();
    const out = items.splice(originIndex.current, 1)[0];
    items.splice(currentIndex.current, 0, out);

    const orders = items.map((el, i) => ({ id: el.id, order: i }));

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
  }, [dragCardId, safety, setSafety]);

  const releaseDrag = useCallback(async () => {
    dispatch(setTargetItem({ id_group: null, id: null }));
    shadowLayout.current && shadowLayout.current.remove();

    if (dragStatus === DragStatusEnum.normal) return;
    dispatch(setStatus(DragStatusEnum.normal));

    if (originIndex.current === currentIndex.current) return;

    if (dragType === DragTypeEnum.group) endGroupDrag();
    if (dragType === DragTypeEnum.item) endItemDrag();
  }, [dispatch, dragStatus, dragType, endGroupDrag, endItemDrag]);

  return { dragStartHandler, draggingHandler, releaseDrag };
}

export default useDrag;
