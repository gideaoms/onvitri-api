import { Product } from '@/types/product'
import { Photo } from '@/types/photo'
import ProductModel from '@/models/product'

/**
 * add photos:
 *   step 1:
 *     a. digito os dados dos produtos
 *     b. clico em proximo, aí salva os dados
 *   step 2:
 *     a. adiciono as imagens e mostro o preview usando apenas JS
 *     b. clico em próximo, nesse momento eu envio as imgs para o servidor
 *        e retorno o json com os dados da foto
 *     c. eu envio o json do produto com as fotos adicionadas, la no servidor
 *        eu simplesmente atualizo o produto
 *   step 3:
 *     a. mostro uma tela com 2 botoes: salvar como rascunho e salvar e publicar
 *
 * remove photos:
 *   step 1:
 *     a. edito as infos do produto
 *     b. clico em proximo, aí salvo os dados do produto
 *   step 2:
 *     a. eu posso adicionar novas fotos e também posso excluir algumas
 *     b. clico em próximo, aí eu envio as novas fotos para o servidor e retorno
 *        o json com os dados das fotos
 *     c. eu envio o json do produto com as fotos adicionadas menos as fotos
 *        removidas, la no servidor eu simplesmente atualizo o produto e excluo
 *        fisicamente as fotos removidas
 */

function ProductPhoto() {
  const productModel = ProductModel()

  async function create(product: Product, photos: Photo[]) {
    const newProduct = productModel.addPhotos(product, photos)
    return newProduct
  }

  async function destroy() {
    //
  }

  return {
    create,
    destroy,
  }
}

export default ProductPhoto
