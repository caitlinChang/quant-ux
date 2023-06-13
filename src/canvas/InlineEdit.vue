<script>
import domAttr from "dojo/domAttr";
import css from "dojo/css";
import on from "dojo/on";

export default {
  name: "InlineEdit",
  mixins: [],
  data: function () {
    return {};
  },
  components: {},
  methods: {
    // 第一次双击进入 widget 的编辑态
    inlineEditInit(widget, resizeToWidth = false, e) {
      this.logger.log(-1, "inlineEditInit", "enter", resizeToWidth);
      this.cleanUpInlineEdit();
      const div = this.renderFactory.getLabelNode(widget);
      if (!div && widget) {
        const editableDiv = document.querySelector(
          `.ComponentWidget_${widget.id}`
        );
        this._inlineEditWidget = widget;
        this._inlineEditDiv = editableDiv;
        this.own(
          on(this._inlineEditDiv, "dblclick", (e) => this.judgeClickOut(e))
        );
        /**
         * FIXME: 在使用 ant-radio-group 时，无法实现内容编辑，可能因为 ant-radio-group 本身的click事件总是会触发radio元素的focus
         * 不知道其他表单元素是否会有这样的情况
         */
        // this.own(on(this._inlineEditDiv, "dblclick", (e) => this.stopEvent(e)));
        this.own(on(this._inlineEditDiv, "click", (e) => this.stopEvent(e)));
        /** end */
        this._inlineEditResizeToWidth = resizeToWidth;
        this._enterEditWdiget();
        // 弃用旧的逻辑
        // this._inlineFocus(null, false, resizeToWidth);
      } else {
        this._inlineEditWidget = widget;
        this._inlineEditDiv = div;
        this._inlineEditResizeToWidth = resizeToWidth;
        this._inlineFocus(null, false, resizeToWidth);
      }
    },
    // 第二次双击 widget 内部的 ReactNode props, 该 ReactNode 才能进行编辑
    inlineEditConfirm() {},

    _enterEditWdiget(e) {
      // 针对单个的widget,进入 编辑模式；
      if (e) {
        e.stopPropagation();
      }
      if (!this._inlineEditStarted && this._inlineEditWidget) {
        css.add(this.domNode, "MatcCanvasModeInlineEdit");
      }

      this._inlineEditStarted = true;
      return true;
    },

    _inlineTargetFocus() {
      if (this._inlineEditStarted && this._inlineEditDiv) {
        this._inlineInnerHTML = this._inlineEditDiv.innerHTML;
        domAttr.set(this._inlineEditDiv, "contenteditable", true);
        this._inlineEditDiv.setAttribute("contentEditable", true);
        this._inlineEditDiv.focus();
        css.add(this._inlineEditDiv, "MatcInlineEditableStarted");
        this.setCursor(this._inlineEditDiv);
      }
    },

    stopEvent(e) {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
    },

    judgeClickOut(e) {
      if (e) {
        e.stopPropagation();
      }
      if (this._inlineEditStarted) {
        // this.clickInEditWidget = true;
        const target = e.target;
        if (target.classList.contains("MatcInlineEditableStarted")) {
          return;
        } else {
          css.remove(target, "MatcInlineEditableStarted");
          this._inlineEditDiv = target;
          this._inlineTargetFocus();
        }
      }
    },

    inlineEditKeyPress(e) {
      if (!this._inlineEditStarted) {
        if (this.getSelectedWidget()) {
          const div = this.renderFactory.getLabelNode(this.getSelectedWidget());
          if (div) {
            this.logger.log(0, "inlineEditKeyPress", "enter");
            this._inlineEditWidget = this.getSelectedWidget();
            this._inlineEditDiv = div;
            this._inlineFocus(e, false);
          }
        }
      }
    },

    inlineEditGetCurrent() {
      if (this._inlineEditWidget && this._inlineEditStarted) {
        const div = this.renderFactory.getLabelNode(this._inlineEditWidget);
        if (div) {
          let txt = div.innerHTML;
          txt = txt.replace(/<div><br>/g, "\n");
          txt = txt.replace(/<div>/g, "\n");
          txt = txt.replace(/<br>/g, "\n");
          txt = txt.replace(/<\/?[^>]+(>|$)/g, "");
          txt = txt.replace(/%/g, "$perc;"); // Mongo cannot deal with % on undo
          if (txt != this._inlineInnerHTML) {
            return txt;
          }
        }
      }
    },

    inlineEditStop() {
      this.logger.log(
        2,
        "inlineEditStop",
        "enter",
        this._inlineEditResizeToWidth
      );

      if (this._inlineEditWidget && this._inlineEditStarted) {
        const div = this.renderFactory.getLabelNode(this._inlineEditWidget);
        if (div) {
          let txt = div.innerHTML;

          /**
           * This is some weird shit with inline editing. Sometimes
           * chrome adds div's, sometimes br's
           */
          txt = txt.replace(/<div><br>/g, "\n");
          txt = txt.replace(/<div>/g, "\n");
          txt = txt.replace(/<br>/g, "\n");
          txt = txt.replace(/<\/?[^>]+(>|$)/g, "");
          txt = txt.replace(/%/g, "$perc;"); // Mongo cannot deal with % on undo

          const resizeToWidth = this._inlineEditResizeToWidth;

          // only chnag ethe widget label when there was a real change, or
          // we need to resize (because we a created a new widget with default message)
          if (txt != this._inlineInnerHTML || resizeToWidth) {
            const id = this._inlineEditWidget.id;

            /**
             * In case of zoom we might flush the value, which will
             * not trigger a rerender(). However, the zooming sets the
             * "old" model in the canvas, which still has the old txt.
             * We update this in here.
             */
            if (this.model.widgets[id]) {
              this.model.widgets[id].props.label = txt;
            }

            /**
             * cleanup before calling the controller, because the controller might
             * trigger an rerender > onChangedSelection > etc recursive
             * loop!
             */
            const noWrap = this._inlineEditWidget.style.nowrap;
            this.cleanUpInlineEdit();

            this.logger.log(
              2,
              "inlineEditStop",
              "exit > FLUSH > " + txt,
              resizeToWidth
            );
            if (resizeToWidth || noWrap === true) {
              this.controller.updateWidgetLabel(id, txt);
            } else {
              this.controller.updateWidgetProperties(
                id,
                { label: txt },
                "props",
                true
              );
            }

            return txt;
          } else {
            this.logger.log(3, "inlineEditStop", "exit > no chnage!");
          }
        }
      }
      this.cleanUpInlineEdit();
      this.clearInlineEditSelections();
    },

    clearInlineEditSelections() {
      if (window.getSelection) {
        if (window.getSelection().empty) {
          // Chrome
          window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) {
          // Firefox
          window.getSelection().removeAllRanges();
        }
      } else if (document.selection) {
        // IE?
        document.selection.empty();
      }
    },

    inlineEditStarted() {
      return this._inlineEditStarted;
    },

    _inlineFocus(e, doNotEmptyOnNull, select) {
      this.logger.log(4, "_inlineFocus", "enter", select);
      /**
       * FIXME. We have to somehow stop this event from doing something false.
       * If there is no label, the first time stopProgationFails. Therefore
       * we set no all labels to all value! In that case stopEvent() works better...
       */
      if (e) {
        e.stopPropagation();
      }

      if (!this._inlineEditStarted && this._inlineEditDiv) {
        // 注视掉原来的逻辑
        // if(!this._inlineEditWidget.props.label &&!doNotEmptyOnNull){
        //     this._inlineEditDiv.innerHTML = "";
        // }
        this._inlineInnerHTML = this._inlineEditDiv.innerHTML;
        domAttr.set(this._inlineEditDiv, "contenteditable", true);
        this._inlineEditDiv.setAttribute("contentEditable", true);
        this._inlineEditDiv.focus();
        css.add(this._inlineEditDiv, "MatcInlineEditableStarted");
        this.setCursor(this._inlineEditDiv);
        // if (this._inlineEditResizeToWidth) {
        // 	this.setAllOfContenteditbale(this._inlineEditDiv)
        // } else {
        // 	this.setEndOfContenteditable(this._inlineEditDiv);
        // }
        css.add(this.domNode, "MatcCanvasModeInlineEdit");
      }

      // make sure we just past raw text
      this._inlineCopyEventListener = on(this._inlineEditDiv, "paste", (e) => {
        try {
          const paste = (e.clipboardData || window.clipboardData).getData(
            "text"
          );
          const selection = window.getSelection();
          if (!selection.rangeCount) return;
          selection.deleteFromDocument();
          selection.getRangeAt(0).insertNode(document.createTextNode(paste));
          selection.collapseToEnd();
          e.preventDefault();
        } catch (err) {
          this.logger.error("_inlineFocus", "Some error on paste", err);
        }
      });

      this._inlineEditStarted = true;

      return true;
    },

    //
    _inlineOnBlur() {
      this._inlineEditStarted = false;
    },

    onInlineEditMouseDown(e) {
      this.stopEvent(e);
    },

    cleanUpInlineEdit() {
      this.logger.log(4, "cleanUpInlineEdit", "enter");

      if (this._inlineEditWidgetDiv) {
        css.remove(this._inlineEditWidgetDiv, "MatcBoxInlineEditing");
        this._inlineEditWidgetDiv = null;
      }

      if (this._inlineCopyEventListener) {
        this._inlineCopyEventListener.remove();
      }

      if (this._inlineEditDiv) {
        domAttr.set(this._inlineEditDiv, "contenteditable", false);
        this._inlineEditDiv.setAttribute("contentEditable", false);
        this._inlineEditDiv.blur();
        css.remove(this._inlineEditDiv, "MatcInlineEditableStarted");
        this._inlineEditDiv = null;
      }

      if (this._inlineMouseDown) {
        this._inlineMouseDown.remove();
        this._inlineMouseDown = null;
      }

      if (this._inlineMouseUp) {
        this._inlineMouseUp.remove();
        this._inlineMouseUp = null;
      }

      this._inlineEditWidget = null;
      this._inlineInnerHTML = null;
      this._inlineEditStarted = false;
      this._inlineEditResizeToWidth = false;

      if (this._inlinebBlurListener) {
        this._inlinebBlurListener.remove();
        this._inlinebBlurListener = null;
      }
      if (this.domNode) {
        css.remove(this.domNode, "MatcCanvasModeInlineEdit");
      }

      //this.setControllerCallback(null);
    },
    setCursor(contentEditableElement) {
      var range;
      if (document.range) {
        range = document.range();
        // 返回用户当前选区
        var sel = window.getSelection();
        range.setStart(contentEditableElement, 0);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    },
    // 将光标设置在可编辑元素末尾
    setEndOfContenteditable(contentEditableElement) {
      var range, selection;
      if (document.createRange) {
        //Firefox, Chrome, Opera, Safari, IE 9+
        range = document.createRange(); //Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
        range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
        // selection = window.getSelection();//get the selection object (allows you to change selection)
        // selection.removeAllRanges();//remove any selections already made
        // selection.addRange(range);//make the range you have just created the visible selection
      } else if (document.selection) {
        //IE 8 and lower
        range = document.body.createTextRange(); //Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement); //Select the entire contents of the element with the range
        range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
        range.select(); //Select the range (make it the visible selection
      }
    },
    // 这个函数没有被用到
    setStartOfContenteditable(contentEditableElement) {
      var range, selection;
      if (document.createRange) {
        //Firefox, Chrome, Opera, Safari, IE 9+
        range = document.createRange(); //Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
        range.collapse(true); //collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection(); //get the selection object (allows you to change selection)
        selection.removeAllRanges(); //remove any selections already made
        selection.addRange(range); //make the range you have just created the visible selection
      } else if (document.selection) {
        //IE 8 and lower
        range = document.body.createTextRange(); //Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement); //Select the entire contents of the element with the range
        range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
        range.select(); //Select the range (make it the visible selection
      }
    },

    setAllOfContenteditbale(contentEditableElement) {
      var sel, range;
      if (window.getSelection && document.createRange) {
        range = document.createRange();
        range.selectNodeContents(contentEditableElement);
        sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      } else if (document.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(contentEditableElement);
        range.select();
      }
    },
  },
  mounted() {},
};
</script>
