import * as tf from '@tensorflow/tfjs';

export function buildModel() {
  // Define a model for linear regression.
  const tfModel = tf.sequential();
  tfModel.add(tf.layers.dense({ units: 1, inputShape: [1] }));

  // Prepare the model for training: Specify the loss and the optimizer.
  tfModel.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

  const a = tf.variable(tf.scalar(Math.random() - 0.5));
  const b = tf.variable(tf.scalar(Math.random() - 0.5));

  function predict(x) {
    return tf.tidy(() => a.mul(x).add(b));
  }

  function loss(predictions, labels) {
    const meanSquareError = predictions.sub(labels).square().mean();
    return meanSquareError;
  }

  const learningRate = 0.05;
  const optimizer = tf.train.sgd(learningRate);

  function train(xs, ys) {
    optimizer.minimize(() => {
      const predsYs = predict(xs);
      return loss(predsYs, ys);
    });
  }

  const model = {
    fit({ x, y }) {
      const xs = tf.tensor([x]);
      const ys = tf.tensor([y]);
      train(xs, ys);
      return { a: a.dataSync()[0], b: b.dataSync()[0] };
    },
    predict(xs) {
      return predict(tf.tensor(xs));
    }
  };

  return model;
}
