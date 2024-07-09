const Delta = Quill.import('delta');
const Parchment = Quill.import('parchment');

const toolbarOptions = [
  [{ header: [1, 2, false] }],
  ['bold', 'italic', 'underline'],
  ['image', 'code-block'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  [{ size: ['small', false, 'large', 'huge'] }],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],
  ['clean'],
  ['link', 'image', 'video'],
];

const quill = new Quill('#editor', {
  modules: {
    toolbar: toolbarOptions,
  },
  theme: 'snow',
});

class QImageText extends Parchment.Embed {
  static create(value) {
    let node = super.create();
    let image = document.createElement('img');
    image.setAttribute('src', value.image);
    node.appendChild(image);

    let text = document.createTextNode(value.text);
    node.appendChild(text);
    return node;
  }

  static value(domNode) {
    let image = domNode.querySelector('img');
    return {
      image: image.getAttribute('src'),
      text: domNode.textContent,
    };
  }
}

QImageText.blotName = 'qImage';
QImageText.tagName = 'q-img-text';
Quill.register(QImageText);

document.getElementById('insert-image-text').addEventListener('click', () => {
  const range = quill.getSelection(true);
  const index = range ? range.index : quill.getLength();

  quill.insertEmbed(index, 'qImage', {
    image: 'https://picsum.photos/200/300',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  });
});

const editor = document.getElementById('editor');
editor.addEventListener('drop', (event) => {
  event.preventDefault();
  const files = event.dataTransfer.files;
  if (files && files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const range = quill.getSelection(true);
      const index = range ? range.index : quill.getLength();

      quill.insertEmbed(index, 'qImage', {
        image: e.target.result,
        text: 'Drag and drop text here.',
      });
    };
    reader.readAsDataURL(files[0]);
  }
});
