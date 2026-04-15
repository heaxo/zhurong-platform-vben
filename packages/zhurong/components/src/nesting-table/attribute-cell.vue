<script lang="tsx">
import {defineComponent} from "vue";
import {message, Tooltip} from 'ant-design-vue';

const props = {
  label1: String,
  label2: String,
  label3: String,
  attribute1: [String, Number, Object],
  attribute2: [String, Number, Object],
  attribute3: [String, Number, Object],
  substring1: [Boolean],
  substring2: [Boolean],
}
export default defineComponent({
  name: "AttributeCell",
  props,
  setup: (props) => {
    function isStringOrNumber(value) {
      return typeof value === 'string' || typeof value === 'number';
    }
    function  handleDoubleClick(event: MouseEvent,textToCopy:string) {
      event.stopPropagation();

      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;

      document.body.appendChild(textarea);

      textarea.select();

      document.execCommand('copy');

      document.body.removeChild(textarea);
      message.success(`复制成功：${textToCopy}`);
    }
    function getLabelClass(label){
      const classes = ['label'];
      if (label && label.trim().length > 2) {
        classes.push('large');
      } else {
        classes.push('small');
      }
      return classes;
    }
    function attr(attribute: any, title: any) {
      if (isStringOrNumber(attribute)) {
        return <Tooltip title={title} placement="right">
          <span style="font-weight: lighter;" onClick={(e) => e.stopPropagation()} onDblclick={(e) => handleDoubleClick(e,attribute)}>{attribute}</span>
        </Tooltip>
      }
      return <span>{attribute}</span>
    }
    return () => {
      const {
        attribute1 = '', attribute2 = '', attribute3 = '',
        label1, label2, label3,
        substring1, substring2,
      } = props;
      return (<div class="info">
        <div>
          <div>
            <span class={getLabelClass(label1)}>
              {label1 ? `${label1}: ` : ""}
            </span>
            &emsp;{attr(attribute1,substring1 ? `${attribute1}${attribute2}${attribute3}` : attribute1)}
          </div>
          <div>
            <span class={getLabelClass(label2)}>
              {label2 ?`${label2}: ` : ""}
            </span>
            &emsp;{attr(attribute2,substring1 ? '' : substring2 ? `${attribute2}${attribute3}` : attribute2)}
          </div>
          <div>
             <span class={getLabelClass(label3)}>
               {label3 ?`${label3}: ` : ""}
              </span>
            &emsp;{attr(attribute3,substring2 ? '' : attribute3)}
          </div>
        </div>
      </div>)
    }
  }
})

</script>
<style scoped>
.info{
  width:100%;
  text-align: left;
  align-items: center;
  div>div{
    text-overflow:ellipsis;
    overflow: hidden;
    white-space: nowrap;
    word-break: break-all;
  }
}

.label {
  display: inline-block;
  text-align-last: justify;
}
.label.small {
  width: 40px;
}

.label.large {
  width: 84px;
}
</style>
